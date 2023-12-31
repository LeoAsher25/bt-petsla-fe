import React from "react";
import {
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import CheckoutSteps from "src/pages/checkoutStepPages/components/CheckoutSteps";
import { RootState } from "src/stores/rootReducer";
import { ERouterPath } from "src/types/route";
import { useAppSelector } from "src/utils/hook.ts/customReduxHook";

const ReviewPage = () => {
  const { themeState } = useAppSelector((state: RootState) => state);
  const { style } = themeState;

  return (
    <div className="cart-page">
      <Container className="cart-page-container">
        {/* <Row>
          <CheckoutSteps pathname={ERouterPath.REVIEW} />
        </Row> */}

        <Row>
          <Col xs="12" md="7" lg="8"></Col>
          <Col xs="12" md="5" lg="4">
            <Card
              style={{
                backgroundColor: style.backgroundColor,
                // color: style.color,
              }}>
              <div className="cart-page-content">
                <div className="body">
                  <div className="voucher-wrap">
                    <FloatingLabel label="Brief Note">
                      <Form.Control
                        style={{
                          backgroundColor: style.backgroundColor1,
                          color: style.color,
                        }}
                        className="cart-page-note"
                        as="textarea"
                        type="text"
                        placeholder="Brief Note"
                      />
                    </FloatingLabel>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReviewPage;
