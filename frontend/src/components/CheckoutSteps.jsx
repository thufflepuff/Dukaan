import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { selectIsToggled } from '../slices/toggleSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {

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
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link className={isToggled ? 'text-white' : 'text-grey'}>Sign In</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link>Sign In</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link className={isToggled ? 'text-white' : 'text-grey'}>Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled >Shipping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link className={isToggled ? 'text-white' : 'text-grey'}>Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link className={isToggled ? 'text-white' : 'text-grey'}>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
