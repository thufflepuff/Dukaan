import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import { selectIsToggled } from '../slices/toggleSlice';

const OrderScreen = () => {

  //theme part
  const isToggled = useSelector(selectIsToggled);
  useEffect(() => {
    if (isToggled) {
      document.body.classList.add('bg-black');
    } else {
      document.body.classList.remove('bg-black');
    }
  }, [isToggled]);
   

  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();

  //   toast.success('Order is paid');
  // }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <h1 className={isToggled ? 'text-white' : 'text-black'}>Order <span style={{ fontSize: '20px', color: 'lightgray' }}>{order._id}</span></h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}s>
              <h2 className={isToggled ? 'text-white' : 'text-grey'}s>Shipping</h2>
              <p className={isToggled ? 'text-white' : 'text-grey'}>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p className={isToggled ? 'text-white' : 'text-grey'}>
                <strong>Email: </strong>{' '}
                <a className={isToggled ? 'text-black' : 'text-black'} href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p className={isToggled ? 'text-white' : 'text-grey'}>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
              <h2 className={isToggled ? 'text-white' : 'text-grey'}>Payment Method</h2>
              <p>
                <strong className={isToggled ? 'text-white' : 'text-grey'}>Method: </strong>
                <h7 className={isToggled ? 'text-white' : 'text-grey'}>{order.paymentMethod}</h7>
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
              <h2 className={isToggled ? 'text-white' : 'text-grey'}>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
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
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <Row className={isToggled ? 'text-white' : 'text-grey'}>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <Row className={isToggled ? 'text-white' : 'text-grey'}>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                <Row className={isToggled ? 'text-white' : 'text-grey'}>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                        
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item className={isToggled ? 'list-group-item-dark' : 'list-group-item-light'}>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
