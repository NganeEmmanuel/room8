import { useEffect, useState } from "react"
import ListingsCategoryScroller from "../../components/ListingCategoryScroller.jsx"
import mockListings from "../../mock/mock.js"

const HomePage = () => {
  const [listings, setListings] = useState([])

  useEffect(() => {
    mockListings({}).then((data) => {
      setListings(data)
    })
  }, [])

  return (
    <div className="px-4">
      <ListingsCategoryScroller
        title="Similar Listings"
        listings={listings}
        filterType="price"
        onSeeMore={() => console.log("Clicked see more")}
      />
    </div>
  )
}

export default HomePage
