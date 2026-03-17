import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
  async update(entity: Order): Promise<void> {
    // Atualizamos o order
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: { id: entity.id },
      }
    );

    // Removemos os itens antigos
    await OrderItemModel.destroy({
      where: { order_id: entity.id },
    });

    // Criamos os novos itens
    await OrderItemModel.bulkCreate(
      entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }))
    );
  }
  async find(id: string): Promise<Order> {

    const orderModel = await OrderModel.findOne({
        where: { id },
        include: [{ model: OrderItemModel }],
      });

    if (!orderModel) {
      throw new Error("Order not found");
    }

    const itens = orderModel.items.map((item: OrderItemModel) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      );
    });
    
    const order = new Order(
      orderModel.id,
      orderModel.customer_id,
      itens
    );
    
    return order;
  }
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    const orders = orderModels.map((orderModel: OrderModel) => {
      const orderItens = orderModel.items.map((item: OrderItemModel) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        );
      });
      
      return new Order(
        orderModel.id,
        orderModel.customer_id,
        orderItens
      );
    });

    return orders;
  }
}
