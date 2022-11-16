import cartage_road_destinatary from "./Cartage/cartage_road_destinatary"
import cartage_road_carrier from "./Cartage/cartage_road_carrier"

export default {
    name: "",
    description: "",
    date: "",
    installation_id: "",
    destinatary_data: {...cartage_road_destinatary},
    carrier_data: {...cartage_road_carrier},

    // Relations
    installation: ""
}