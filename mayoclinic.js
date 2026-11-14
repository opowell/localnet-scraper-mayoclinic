// A page about a disease, a test or a drug (/diseases-conditions/diabetes/symptoms-causes/syc-20371444) reads as its
// title (<h1>, its lines joined: "Diabetes: Symptoms and causes") and the paragraphs, headings, list items and
// pictures of each part of its topic (TopicContent), without the
// advertising and appointment boxes among them, linking with weight 0.1 to each page its text links to. An index
// (/diseases-conditions/index?letter=A) is a listing of each page it lists.
function parseMayoClinic(_profileId) {
  if (!/(?:^|\.)mayoclinic\.org$/.test(location.hostname)) {
    return null
  }
  if (/\/index$/.test(location.pathname)) {
    const section = location.pathname.split('/')[1]
    return listingOf(linkUrls(`main a[href*="/${section}/"]`).map(url => url.split(/[?#]/)[0])
      .filter(url => !/\/index$/.test(url) && new URL(url).pathname.split('/').length > 3)) ?? { listing: true }
  }
  const found = Array.from(document.querySelectorAll('[data-testid="topic-content"], .TopicContent'))
  const topic = found.filter(part => !found.some(other => other !== part && other.contains(part)))
  const title = document.querySelector('main h1, h1')?.innerText.replace(/\s*\n\s*/g, ': ').trim()
  const skip = '[class*="advertisement"], [class*="Advertisement"], [data-testid*="ad-"], [class*="appointment"], [class*="Appointment"], aside'
  const content = topic.flatMap(part => textBlocks(part, { lists: true, skip }))
  if (!title || !content.length) {
    return null
  }
  return { title, content, links: contentLinks(topic, { skip }) }
}

// The parser a scrape calls.
registerParser(parseMayoClinic)
