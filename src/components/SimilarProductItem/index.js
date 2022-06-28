// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, brand, price, rating} = productDetails
  return (
    <li className="product-list-item">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="price-rating-container">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-rating-container">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="start-icon"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
