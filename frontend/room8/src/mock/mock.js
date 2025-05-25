// src/mocks/mockListings.js
import img1 from "../assets/images/house2.png"
import img2 from "../assets/images/house3.png"
import img3 from "../assets/images/house1.png"
import img4 from "../assets/images/house.png"

const images = [img1, img2, img3, img4]

const mockListings = async (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let listings = Array(60).fill(0).map((_, i) => ({
        id: i,
        title: `Listing ${i + 1}`,
        location: ["Abuja", "Lagos", "Enugu"][i % 3],
        price: 30000 + i * 1000, // number for filtering
        image: images[i % images.length],
        roomType: ["Studio", "Apartment", "Single Room"][i % 3],
      }))

      // Filter by search term (in title or location)
      if (filters.term) {
        const term = filters.term.toLowerCase()
        listings = listings.filter(listing =>
          listing.title.toLowerCase().includes(term) ||
          listing.location.toLowerCase().includes(term)
        )
      }

      // Filter by exact location if specified
      if (filters.location) {
        const loc = filters.location.toLowerCase()
        listings = listings.filter(listing =>
          listing.location.toLowerCase() === loc
        )
      }

      // Filter by price range (min and max)
      if (filters.priceMin || filters.priceMax) {
        const min = Number(filters.priceMin) || 0
        const max = Number(filters.priceMax) || Infinity
        listings = listings.filter(listing =>
          listing.price >= min && listing.price <= max
        )
      }

      // Sort listings
      listings = (() => {
        switch (filters.sort) {
          case "price-asc":
            return [...listings].sort((a, b) => a.price - b.price)
          case "price-desc":
            return [...listings].sort((a, b) => b.price - a.price)
          default:
            return listings
        }
      })()

      // Format price with currency string
      listings = listings.map(listing => ({
        ...listing,
        price: listing.price + " FCFA"
      }))

      resolve(listings)
    }, 1000)
  })
}

export default mockListings
