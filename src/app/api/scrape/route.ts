import { NextResponse } from 'next/server';
import puppeteer, { Page, ElementHandle } from 'puppeteer';
import { Product } from '@/types/product';

export async function POST(request: Request) {
  let browser;
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    
    // Set a reasonable timeout
    await page.setDefaultNavigationTimeout(30000);
    
    // Enable JavaScript
    await page.setJavaScriptEnabled(true);
    
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Extract product information based on the URL type (Amazon or Shopify)
    const isAmazon = url.includes('amazon');
    const isShopify = url.includes('shopify');

    let product: Product;

    if (isAmazon) {
      product = await scrapeAmazon(page);
    } else if (isShopify) {
      product = await scrapeShopify(page);
    } else {
      throw new Error('Unsupported website. Please provide an Amazon or Shopify product URL.');
    }

    await browser.close();
    return NextResponse.json(product);
  } catch (error) {
    console.error('Scraping error:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to scrape product data' },
      { status: 500 }
    );
  }
}

async function scrapeAmazon(page: Page): Promise<Product> {
  // Helper function to safely extract text content
  const safeTextExtract = async (selector: string, fallback = ''): Promise<string> => {
    try {
      const element = await page.$(selector);
      return element ? (await element.evaluate((el: Element) => el.textContent?.trim() || '')) : fallback;
    } catch {
      return fallback;
    }
  };

  // Helper function to safely extract multiple image URLs
  const safeImagesExtract = async (): Promise<string[]> => {
    const images: string[] = [];
    
    try {
      // Try to get the highest quality image from the main product image
      const mainImage = await page.$eval(
        '#landingImage, #imgBlkFront, #main-image',
        (el: Element) => {
          if (el instanceof HTMLImageElement) {
            // Get the data-a-dynamic-image attribute which contains all available sizes
            const dynamicImages = el.getAttribute('data-a-dynamic-image');
            if (dynamicImages) {
              try {
                const images = JSON.parse(dynamicImages);
                // Get the URL with the highest dimensions
                return Object.entries(images)
                  .sort(([, a]: any, [, b]: any) => (b.width * b.height) - (a.width * a.height))[0][0];
              } catch {
                // Fallback to other high-res sources
                return el.getAttribute('data-old-hires') || 
                       el.getAttribute('data-zoom-hires') || 
                       el.src;
              }
            }
            return el.getAttribute('data-old-hires') || 
                   el.getAttribute('data-zoom-hires') || 
                   el.src;
          }
          return '';
        }
      ).catch(() => '');

      if (mainImage) {
        images.push(mainImage);
      }

      // Try to get all variant images in high resolution
      const variantImages = await page.$$eval(
        '#altImages img, #imageBlock img, .imgTagWrapper img, .a-button-thumbnail img',
        (elements: Element[]) => {
          return elements.map((el) => {
            if (el instanceof HTMLImageElement) {
              const hiRes = el.getAttribute('data-old-hires') || 
                          el.getAttribute('data-zoom-hires');
              
              // Check for dynamic images
              const dynamicImages = el.getAttribute('data-a-dynamic-image');
              if (dynamicImages) {
                try {
                  const images = JSON.parse(dynamicImages);
                  // Get the URL with the highest dimensions
                  return Object.entries(images)
                    .sort(([, a]: any, [, b]: any) => (b.width * b.height) - (a.width * a.height))[0][0];
                } catch {
                  return hiRes || el.src;
                }
              }
              
              return hiRes || el.src;
            }
            return '';
          }).filter(url => 
            url && 
            !url.includes('sprite') && 
            !url.includes('placeholder') && 
            !url.includes('gif') &&
            !url.includes('thumb') && 
            !url.includes('small') &&
            !url.includes('SS40') &&
            !url.includes('mini')
          );
        }
      );
      
      images.push(...variantImages);

      // Remove duplicates and filter out low-quality images
      return [...new Set(images)].filter(url => {
        // Filter out low-resolution images
        const isLowRes = url.includes('_SL') || url.includes('_SR');
        if (isLowRes) {
          // Extract resolution from URL if possible
          const match = url.match(/_S[LR](\d+)_/);
          if (match) {
            const resolution = parseInt(match[1]);
            return resolution >= 800; // Only keep images with resolution >= 800
          }
        }
        return true;
      }).map(url => {
        // Try to get the highest resolution version by modifying Amazon image URLs
        return url.replace(/_S[LR]\d+_/g, '_SL1500_')
                 .replace(/\._[^.]*_\./, '.') // Remove quality modifiers
                 .replace(/\._(AA|AB|AC|AD|AE)\d+_/, '.'); // Remove Amazon's size suffixes
      });
    } catch (error) {
      console.error('Error extracting images:', error);
      return images;
    }
  };

  const title = await safeTextExtract('#productTitle');
  if (!title) {
    throw new Error('Could not find product title');
  }

  const images = await safeImagesExtract();
  if (images.length === 0) {
    throw new Error('Could not find product images');
  }

  const price = await safeTextExtract('.a-price .a-offscreen, #priceblock_ourprice, #price_inside_buybox');
  const description = await safeTextExtract('#productDescription p, #feature-bullets');
  
  const features = await page.$$eval(
    '#feature-bullets li span, #productDescription ul li', 
    (elements: Element[]) => elements.map((el: Element) => el.textContent?.trim() || '').filter(Boolean)
  );

  return {
    title,
    image: images[0], // Main image
    images: images.slice(1), // Additional images
    price,
    description,
    features,
    url: page.url(),
  };
}

async function scrapeShopify(page: Page): Promise<Product> {
  // Helper function to safely extract text content
  const safeTextExtract = async (selector: string, fallback = ''): Promise<string> => {
    try {
      const element = await page.$(selector);
      return element ? (await element.evaluate((el: Element) => el.textContent?.trim() || '')) : fallback;
    } catch {
      return fallback;
    }
  };

  // Helper function to safely extract multiple image URLs
  const safeImagesExtract = async (): Promise<string[]> => {
    const images: string[] = [];
    
    try {
      // Try to get images from the product gallery
      const galleryImages = await page.$$eval(
        '.product-gallery img, .product__media img, .product-single__media img, [data-product-media-type="image"] img',
        (elements: Element[]) => {
          return elements.map((el) => {
            if (el instanceof HTMLImageElement) {
              // Try to get the highest resolution version
              const srcset = el.getAttribute('srcset');
              if (srcset) {
                // Parse srcset and get the highest resolution URL
                const sources = srcset.split(',')
                  .map(src => {
                    const [url, width] = src.trim().split(' ');
                    return {
                      url,
                      width: parseInt(width?.replace('w', '') || '0')
                    };
                  })
                  .sort((a, b) => b.width - a.width);
                
                if (sources.length > 0) {
                  return sources[0].url;
                }
              }
              
              // Try to get original image by removing Shopify's image parameters
              const src = el.src || el.getAttribute('data-src') || '';
              if (src) {
                // Remove Shopify's image parameters to get the original size
                return src.split('?')[0].replace(/_\d+x\d+\./, '.');
              }
            }
            return '';
          }).filter(url => 
            url && 
            !url.includes('loader') && 
            !url.includes('placeholder') &&
            !url.includes('no-image') &&
            !url.includes('blank')
          );
        }
      );
      
      images.push(...galleryImages);

      // Try to get images from JSON data in the page
      const jsonData = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/json"]'));
        for (const script of scripts) {
          try {
            const data = JSON.parse(script.textContent || '');
            if (data.product && data.product.images) {
              return data.product.images;
            }
          } catch {
            continue;
          }
        }
        return null;
      });

      if (jsonData && Array.isArray(jsonData)) {
        const highResImages = jsonData
          .map((img: any) => {
            if (typeof img === 'string') {
              return img.split('?')[0].replace(/_\d+x\d+\./, '.');
            }
            return '';
          })
          .filter(Boolean);
        
        images.push(...highResImages);
      }
    } catch (error) {
      console.error('Error extracting images:', error);
    }

    // Remove duplicates and ensure we have full resolution images
    return [...new Set(images)].map(url => {
      // Remove any Shopify image parameters to get original size
      return url.split('?')[0].replace(/_\d+x\d+\./, '.');
    });
  };

  const title = await safeTextExtract('.product-title, .product__title, h1');
  if (!title) {
    throw new Error('Could not find product title');
  }

  const images = await safeImagesExtract();
  if (images.length === 0) {
    throw new Error('Could not find product images');
  }

  const price = await safeTextExtract('.product-price, .price__regular, .product__price');
  const description = await safeTextExtract('.product-description, .product__description');
  
  const features = await page.$$eval(
    '.product-features li, .product__features li', 
    (elements: Element[]) => elements.map((el: Element) => el.textContent?.trim() || '').filter(Boolean)
  );

  return {
    title,
    image: images[0], // Main image
    images: images.slice(1), // Additional images
    price,
    description,
    features,
    url: page.url(),
  };
} 