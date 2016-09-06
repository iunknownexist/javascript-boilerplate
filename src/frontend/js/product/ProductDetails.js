import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { Link } from 'react-router';
import HelmetTitle from '../app/HelmetTitle';
import Loading from '../app/Loading';
import productActions from './actions';
import ProductPropType from './productPropTypes';
import { addProductToShoppingCart } from '../shoppingcart/actions';
import { getProductById } from './reducer';

const ProductDetails = ({ reference, description, price, image, orderProduct }) => (
    <div className="row product-details">
        <HelmetTitle title={name} />
        <div className="col-xs-12 col-md-4 col-lg-3">
            <img src={image} alt={name} className="img-thumbnail" />
        </div>
        <div className="col-xs-12 col-md-8 col-lg-9">
            <h2>{reference}</h2>
            <p className="description">{description}</p>
            <p className="price">Price: {numeral(price).format('$0.00')}</p>
            <p>
                <button
                    onClick={orderProduct}
                    className="btn btn-primary"
                >
                    Buy
                </button>
                <Link to="/products" className="btn btn-link">Return to product list</Link>
            </p>
        </div>
    </div>
);

ProductDetails.propTypes = ProductPropType;

class ProductDetailsContainer extends Component {
    componentDidMount() {
        if (!this.props.product) {
            this.props.loadProduct(this.props.productId);
        }
    }

    orderProduct = () => {
        const { orderProduct, product } = this.props;
        orderProduct(product);
    }

    render() {
        const { loading, product } = this.props;

        if (loading || !product) {
            return (
                <div className="col-xs-12">
                    <Loading />
                </div>
            );
        }

        return <ProductDetails {... { ...product, orderProduct: this.orderProduct }} />;
    }
}

ProductDetailsContainer.propTypes = {
    productId: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    product: PropTypes.shape(ProductPropType),
    loadProduct: PropTypes.func.isRequired,
    orderProduct: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    const productId = parseInt(ownProps.params.id, 10);

    return {
        loading: state.product.loading,
        productId,
        product: state.product.item || getProductById(state, productId),
    };
};

const mapDispatchToProps = ({
    loadProduct: productActions.item.request,
    orderProduct: addProductToShoppingCart,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailsContainer);
