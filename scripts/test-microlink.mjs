import fetch from 'node-fetch';

async function test() {
  const link = "https://healthpointranchi.com/";
  console.log(`Testing Microlink API for ${link}...`);
  
  const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(link)}&screenshot=true&meta=false&waitForTimeout=3000&fullPage=true`;
  
  try {
    const res = await fetch(apiUrl);
    const json = await res.json();
    console.log("Response:", JSON.stringify(json, null, 2));
    
    if (json.data && json.data.screenshot && json.data.screenshot.url) {
      console.log("Success! Screenshot URL:", json.data.screenshot.url);
    } else {
      console.log("Screenshot URL not found in response.");
    }
  } catch (e) {
    console.error(e);
  }
}

test();
