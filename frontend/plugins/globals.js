import { CellGroup, Field, Form, NavBar } from "vant";
import { createApp } from "vue";

const app = createApp();
app.use(NavBar);
app.use(Form);
app.use(Field);
app.use(CellGroup);
