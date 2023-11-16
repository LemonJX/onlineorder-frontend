import { Button, Drawer, List, message, Typography, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { checkout, addItemToCart, deleteItemFromCart, getCart } from "../utils";
import { ClearOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DeleteButton = ({ itemId, onCartClose }) => {
  const [loading, setLoading] = useState(false);

  const DeleteFromCart = () => {
    setLoading(true);
    deleteItemFromCart(itemId)
      .then(() => {
        message.success(`Successfully delete item`);
        onCartClose();
      })
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Tooltip title="Delete from shopping cart">
      <Button
        loading={loading}
        style={{ border: "none" }}
        icon={<MinusOutlined />}
        onClick={DeleteFromCart}
      />
    </Tooltip>
  );
};

const AddButton = ({ itemId, onCartClose }) => {
  const [loading, setLoading] = useState(false);

  const AddToCart = () => {
    setLoading(true);
    addItemToCart(itemId)
      .then(() => {
        message.success(`Successfully add item`);
        onCartClose();
      })
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Tooltip title="Add to shopping cart">
      <Button
        loading={loading}
        style={{ border: "none" }}
        icon={<PlusOutlined />}
        onClick={AddToCart}
      />
    </Tooltip>
  );
};

const MyCart = () => {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartData, setCartData] = useState();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  // get ths shopping cart data
  useEffect(() => {
    if (!cartVisible) {
      return;
    }

    setLoading(true);
    getCart()
      .then((data) => {
        setCartData(data);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cartVisible]);

  const onCheckOut = () => {
    setChecking(true);
    checkout()
      .then(() => {
        message.success("Successfully checkout");
        setCartVisible(false);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setChecking(false);
      });
  };

  const onClearCart = () => {
    setChecking(true);
    checkout()
      .then(() => {
        setCartVisible(false);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setChecking(false);
      });
  };

  const onCloseDrawer = () => {
    setCartVisible(false);
  };

  const onOpenDrawer = () => {
    setCartVisible(true);
  };

  return (
    <>
      <Button type="primary" shape="round" onClick={onOpenDrawer}>
        Cart
      </Button>
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text strong={true}>My Shopping Cart</Text>
            <Button
              loading={checking}
              disabled={loading || cartData?.order_items.length === 0}
              style={{ border: "none" }}
              icon={<ClearOutlined style={{ fontSize: "20px" }} />}
              onClick={onClearCart}
            />
          </div>
        }
        onClose={onCloseDrawer}
        visible={cartVisible}
        width={420}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text strong={true}>{`Total: $${cartData?.total_price}`}</Text>
            <Button
              onClick={onCheckOut}
              type="primary"
              shape="round"
              loading={checking}
              disabled={loading || cartData?.order_items.length === 0}
            >
              Checkout
            </Button>
          </div>
        }
      >
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={cartData?.order_items}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.menu_item_name}
                description={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{ marginRight: "auto" }}
                    >{`$${item.price}`}</span>

                    {item.quantity !== 1 && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <DeleteButton
                          itemId={item.menu_item_id}
                          onCartClose={onCloseDrawer}
                        />
                        <span
                          style={{ margin: "0 8px" }}
                        >{`${item.quantity}`}</span>
                      </div>
                    )}
                    <AddButton
                      itemId={item.menu_item_id}
                      onCartClose={onCloseDrawer}
                    />
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};

export default MyCart;
