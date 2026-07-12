export const ADD_ITEM = "ADD_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const UPDATE_QUANTITY = "UPDATE_QUANTITY";
export const CLEAR_CART = "CLEAR_CART";

export const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const item = action.payload;
      const existItem = state.find((i) => i.productId === item.productId);

      if (existItem) {
        const newQuantity = existItem.quantity + item.quantity;

        // Prevent exceeding stock
        if (newQuantity > item.stock) {
          return state.map((i) =>
            i.productId === item.productId ? { ...i, quantity: item.stock } : i
          );
        }

        return state.map((i) =>
          i.productId === item.productId ? { ...i, quantity: newQuantity } : i
        );
      }

      // Add new item, ensure quantity doesn’t exceed stock
      return [
        ...state,
        { ...item, quantity: Math.min(item.quantity, item.stock) },
      ];
    }

    case REMOVE_ITEM:
      return state.filter((i) => i.productId !== action.payload.productId);

    case UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((i) => i.productId !== productId);
      }
      return state.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
    }

    case CLEAR_CART:
      return [];

    default:
      return state;
  }
};
