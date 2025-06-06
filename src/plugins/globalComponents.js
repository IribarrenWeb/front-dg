import Badge from "../components/core_components/Badge";
import BaseAlert from "../components/core_components/BaseAlert";
import BaseButton from "../components/core_components/BaseButton";
import BaseCheckbox from "../components/core_components/BaseCheckbox";
import BaseDropdown from "../components/core_components/BaseDropdown";
import BaseHeader from "../components/core_components/BaseHeader";
import BaseInput from "../components/core_components/BaseInput";
import BaseSteps from "../components/core_components/BaseSteps";
import BaseNav from "../components/core_components/BaseNav";
import BasePagination from "../components/core_components/BasePagination";
import BaseProgress from "../components/core_components/BaseProgress";
import BaseSwitch from "../components/core_components/BaseSwitch";
import BaseRadio from "../components/core_components/BaseRadio";
import BaseTable from "../components/core_components/BaseTable";
import Card from "../components/core_components/Card";
import Camera from "../components/core_components/Camera";
import Modal from "../components/core_components/Modal";
import StatsCard from "../components/core_components/StatsCard";
import TabPane from "../components/core_components/Tabs/TabPane.vue";
import Tabs from "../components/core_components/Tabs/Tabs";
import FormDelegate from "../components/Delegate/FormDelegate.vue";
import FormMaterial from "../components/Materials/FormMaterial.vue";
import FormAuditor from "../components/Auditor/FormAuditor.vue";
import BaseSelect from "../components/core_components/BaseSelect.vue";
import BaseField from "../components/core_components/BaseField.vue";
import Loader from "../components/core_components/Loader.vue";
import { ElTooltip, ElPopover } from "element-plus";
import { Field, Form, ErrorMessage, FieldArray } from "vee-validate";
import ErrorBoundary from "vue-error-boundary";
import CameraComponent from "simple-vue-camera";
// import Multiselect from '@vueform/multiselect';

const GlobalComponents = {
    install(app) {
        app.component("form-auditor", FormAuditor);
        app.component("form-delegate", FormDelegate);
        app.component("form-material", FormMaterial);
        app.component("badge", Badge);
        app.component("camera-component", CameraComponent);
        app.component("base-alert", BaseAlert);
        app.component("base-button", BaseButton);
        app.component("base-checkbox", BaseCheckbox);
        app.component("base-dropdown", BaseDropdown);
        app.component("base-header", BaseHeader);
        app.component("base-input", BaseInput);
        app.component("base-nav", BaseNav);
        app.component("base-pagination", BasePagination);
        app.component("base-progress", BaseProgress);
        app.component("base-switch", BaseSwitch);
        app.component("base-radio", BaseRadio);
        app.component("base-table", BaseTable);
        app.component("base-field", BaseField);
        app.component("base-steps", BaseSteps);
        app.component("base-select", BaseSelect);
        app.component("card", Card);
        app.component("camera", Camera);
        app.component("loader", Loader);
        app.component("modal", Modal);
        app.component("stats-card", StatsCard);
        app.component("tab-pane", TabPane);
        app.component("tabs", Tabs);
        app.component("field-validate", Field);
        app.component("form-validate", Form);
        app.component("error-boundary", ErrorBoundary);
        app.component("field-array-validate", FieldArray);
        // app.component("multi-selecty", Multiselect);
        app.component("error-message-validate", ErrorMessage);
        app.use(ElTooltip);
        app.use(ElPopover);
    },
};

export default GlobalComponents;