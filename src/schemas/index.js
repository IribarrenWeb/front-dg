import business from "./business";
import installation from "./installation";
import employee from "./employee";
import auditor from "./auditor";
import delegate from "./delegate";
import formation from "./formation";
import address from "./address";
import cartage from "./cartage";
import cartage_road from "./cartage_road";
import cartage_destinatary from "./Cartage/cartage_road_destinatary";
import cartage_carrier from "./Cartage/cartage_road_carrier";
import cartage_loader from "./Cartage/cartage_road_loader";

const schemas = {
    business,
    installation,
    employee,
    auditor,
    delegate,
    formation,
    address,
    cartage,
    cartage_road,

    // Modules schemas
    cartage_destinatary,
    cartage_carrier,
    cartage_loader
}

export default schemas