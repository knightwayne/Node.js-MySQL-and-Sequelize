const Product = require('../models/product');
const Cart = require('../models/cart');
const db = require('../util/database');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(product=>{
    res.render('shop/product-list', {
      prods: product,
      pageTitle: 'Shop',
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err);
  });
  /*Product.fetchAll()
  .then(([rows, fieldData])=>{  //deconstructing - [rows. fieldData] -> array containing returned results of query
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err);
  });*/
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({where: {
    id: prodId
  } })
  .then((fetchedProduct)=>{
   // console.log(fetchedProduct);
    res.render('shop/product-detail', {
      product: fetchedProduct[0] ,
      pageTitle: fetchedProduct[0].title,
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err);
  });
  /*Product.findByPk(prodId)
  .then((fetchedProduct)=>{
    console.log(fetchedProduct);
    res.render('shop/product-detail', {
      product: fetchedProduct ,
      pageTitle: fetchedProduct.title,
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err);
  });*/
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(product=>{
    res.render('shop/index', {
      prods: product,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err);
  });
  /*Product.fetchAll()
  .then(([rows, fieldData])=>{  //deconstructing
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err=>{
    console.log(err);
  });*/ 
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
