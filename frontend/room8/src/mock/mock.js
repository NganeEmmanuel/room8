// src/mocks/mockListings.js
import img1 from "../assets/images/house2.png"
import img2 from "../assets/images/house3.png"
import img3 from "../assets/images/house1.png"
import img4 from "../assets/images/house.png"

const images = [img1, img2, img3, img4]

const mockListings = async (filters) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockListings = Array(60).fill(0).map((_, i) => ({
        id: i,
        title: `Listing extended title area to see what it shows${i + 1}`,
        location: ["Abuja", "Lagos", "Enugu"][i % 3],
        price: 30000 + i * 1000,
        image: images[i % images.length],
        roomType: ["Studio", "Apartment", "Single Room"][i % 3],
      }))

      const sorted = (() => {
        switch (filters.sort) {
          case "price-asc":
            return [...mockListings].sort((a, b) => a.price - b.price)
          case "price-desc":
            return [...mockListings].sort((a, b) => b.price - a.price)
          default:
            return mockListings
        }
      })()

      resolve(sorted)
    }, 1000)
  })
}

export default mockListings
