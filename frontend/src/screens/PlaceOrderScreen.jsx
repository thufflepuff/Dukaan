import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { selectIsToggled } from '../slices/toggleSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  //theme part
  const isToggled = useSelector(selectIsToggled);
  useEffect(() => {
    if (isToggled) {
      document.body.classList.add('bg-black');
    } else {
      document.body.classList.remove('bg-black');
    }
  }, [isToggled]);
   

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item  className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
              <h2 className={isToggled ? 'text-white' : 'text-grey'}>Shipping</h2>
              <p className={isToggled ? 'text-white' : 'text-grey'}>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
              <h2 className={isToggled ? 'text-white' : 'text-grey'}>Payment Method</h2>
              <strong className={isToggled ? 'text-white' : 'text-grey'}>Method: </strong>
              <h7 className={isToggled ? 'text-white' : 'text-grey'}>{cart.paymentMethod}</h7>
            </ListGroup.Item>

            <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
              <h2 className={isToggled ? 'text-white' : 'text-grey'}>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index} >
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <h2 className={isToggled ? 'text-white' : 'text-grey'}>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <Row className={isToggled ? 'text-white' : 'text-grey'}>
                  <Col>${cart.itemsPrice}</Col>
                  <Col>Items</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <Row className={isToggled ? 'text-white' : 'text-grey'}>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <Row className={isToggled ? 'text-white' : 'text-grey'}>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <Row className={isToggled ? 'text-white' : 'text-grey'}>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                {error && (
                  <Message variant='danger'>{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <Button
                  type='button'
                  className={isToggled ? 'btn-dakr' : 'btn-info'}
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}                  
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
