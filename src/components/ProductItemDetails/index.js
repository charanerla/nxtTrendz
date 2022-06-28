// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: {},
    quantity: 1,
    similarProducts: [],
  }

  componentDidMount() {
    this.fetchProductDetails()
  }

  fetchProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    console.log(params.id)
    const url = `https://apis.ccbp.in/products/${params.id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      console.log(data.id)
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }
      const updatedSimilarProducts = data.similar_products.map(product => ({
        imageUrl: product.image_url,
        title: product.title,
        brand: product.brand,
        price: product.price,
        rating: product.rating,
        id: product.id,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetails: updatedData,
        similarProducts: updatedSimilarProducts,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  decrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  incrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state
    return (
      <ul className="unordered-list-of-similar-products">
        {similarProducts.map(product => (
          <SimilarProductItem productDetails={product} key={product.id} />
        ))}
      </ul>
    )
  }

  renderingTheProductDetails = () => {
    const {productDetails, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails
    return (
      <div className="product-main-container">
        <div className="product-img-description-container">
          <img src={imageUrl} className="product-image" alt="product" />
          <div className="product-description-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-reviews-container">
              <p className="rating-container">
                {rating}
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="start-icon"
                />
              </p>
              <p className="product-reviews">{`${totalReviews} Reviews`} </p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-availability">
              Available:{' '}
              <p className="product-availability-status">{availability}</p>
            </p>
            <p className="product-brand">
              Brand: <p className="product-brand-status">{brand}</p>
            </p>
            <hr className="hr-line" />
            <div className="quantity-container">
              <button
                className="quantity-change-button"
                type="button"
                onClick={this.decrementQuantity}
                testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="product-quantity">{quantity}</p>
              <button
                className="quantity-change-button"
                type="button"
                onClick={this.incrementQuantity}
                testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </div>
    )
  }

  navigateToProductsRoute = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="specific-products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-button"
        onClick={this.navigateToProductsRoute}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderingThePageDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div testid="loader" className="leader-container">
            <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
          </div>
        )
      case apiStatusConstants.success:
        return this.renderingTheProductDetails()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-details-container">
        <Header />
        {this.renderingThePageDetails()}
      </div>
    )
  }
}

export default ProductItemDetails
