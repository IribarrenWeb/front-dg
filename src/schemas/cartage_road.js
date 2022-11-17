import cartage_road_destinatary from "./Cartage/cartage_road_destinatary"
import cartage_road_carrier from "./Cartage/cartage_road_carrier"
import cartage_road_loader from "./Cartage/cartage_road_loader"

export default {
    name: "",
    description: "",
    date: "",
    installation_id: "",
    same_loader: false,
    cartage_loader_id: null,
    cartage_destinatary_id: null,
    cartage_carrier_id: null,
    destinatary_data: {...cartage_road_destinatary},
    carrier_data: {...cartage_road_carrier},
    loader_data: {...cartage_road_loader},
    materials_ids: [],

    // Relations
    installation: {},
    destinatary: {},
    carrier: {},
    loader: {},
    materials: {},
}