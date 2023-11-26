import React from "react";
import { CloseButton } from "react-bootstrap";
import { ICartProduct } from "src/types/productTypes";
import "./TopCartItem.scss";
import getFullPathMedia from "src/utils/Media/getFullPathMedia";

interface ITopCartItemProps {
  isLightTheme?: boolean;
  product: ICartProduct;
  handlePlusToCart?: (id: number | string) => void;
  handleMinusToCart?: (id: number | string) => void;
  handleRemoveFromCart?: (id: number | string) => void;
  isReviewing?: boolean;
}

const TopCartItem = ({
  isLightTheme,
  product,
  handlePlusToCart,
  handleMinusToCart,
  handleRemoveFromCart,
  isReviewing,
}: ITopCartItemProps) => {
  return (
    <div
      className="top-cart-item"
      style={{
        paddingLeft: isReviewing ? "0" : "",
      }}>
      {handlePlusToCart && handleMinusToCart && (
        <div className="quantity-wrap">
          <button
            className="quantity-btn"
            onClick={() => {
              handlePlusToCart && handlePlusToCart(product._id);
            }}>
            <i className="bi bi-plus"></i>
          </button>
          <span className="quantity">{product.quantity}</span>
          <button
            disabled={product.quantity <= 1}
            className={`quantity-btn ${
              product.quantity <= 1 ? "disabled" : ""
            }`}
            onClick={() => {
              handleMinusToCart && handleMinusToCart(product._id);
            }}>
            <i className="bi bi-dash"></i>
          </button>
        </div>
      )}

      <div className="product-info">
        <div
          className="product-img"
          style={{
            backgroundImage: `url('${getFullPathMedia(product.image)}')`,
            marginLeft: isReviewing ? "0" : "",
          }}></div>
        <div className="product-description">
          <div className="product-name">{product.name}</div>
          <div className="product-price">
            {`${product.price.toLocaleString()}đ x ${product.quantity}`}
          </div>
          <div className="product-total-price">
            {`${(product.price * product.quantity).toLocaleString()}đ`}
          </div>
        </div>
      </div>

      {handleRemoveFromCart && (
        <div className="action-wrap">
          <CloseButton
            aria-label="Remove From Cart"
            variant={isLightTheme ? undefined : "white"}
            onClick={() => {
              handleRemoveFromCart && handleRemoveFromCart(product._id);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TopCartItem;
