import { createBrowserRouter } from "react-router-dom";



import Signup from "./auth/signup";
import Login from "./auth/login";
import ListMovie from "./movielist/listmovies";
import Viewddetail from "./movielist/booking";
import TicketBooking from "./movielist/BookingTicket";
import MyBooking from "./movielist/MyBooking";
import CreateData from "./adminonly/create";
import CruedAdmin from "./adminonly/listadmin";
import EditMovie from "./adminonly/editpost";
import Adminlog from "./auth/admin/admin";

const router = createBrowserRouter([
    {path: '', element: <ListMovie/>},
    {path: 'signup', element: <Signup/>},
    {path: 'login', element: <Login/>},
    {path: 'listmovies', element: <ListMovie/>},
    {path: 'views/:movieid', element: <Viewddetail/>},
    {path: 'ticketbook/:movieId', element: <TicketBooking/> },
    {path: 'MyBooking', element: <MyBooking/> },
    {path: 'create', element: <CreateData/> },
    {path: 'cruedadmin', element: <CruedAdmin/> },
    {path: 'editmovie/:movieid', element: <EditMovie/> },
    {path: 'adminlog', element: <Adminlog/> },
    
    
]);
export default router;