// app/pages/ScreenRouter.tsx
import { Screen } from "../types/types";
import { ProductDetail } from "./ProductDetail";
import { ProductListing } from "./ProductListing";
import { Payment } from "./Payment";
import { PaymentSuccess } from "./PaymentSuccess";
import { PaymentFailed } from "./PaymentFailed";
import { Profile } from "../components/Profile";
import { AdminPanel } from "../components/AdminPanel";

export default function ScreenRouter({ 
  view, 
  product, 
  orders, 
  user, 
  handlers 
}: any) {

  switch (view) {
    case Screen.LISTING:
      return <ProductListing {...handlers.listing} user={user} />;

    case Screen.DETAIL:
      return <ProductDetail product={product} {...handlers.detail} />;

    case Screen.PAYMENT:
      return <Payment product={product} {...handlers.payment} />;

    case Screen.SUCCESS:
      return <PaymentSuccess product={product} {...handlers.success} />;

    case Screen.FAILED:
      return <PaymentFailed product={product} {...handlers.failed} />;

    case Screen.PROFILE:
      return <Profile user={user} orders={orders} {...handlers.profile} />;

    case Screen.ADMIN:
      return <AdminPanel {...handlers.admin} />;

    default:
      return null;
  }
}
