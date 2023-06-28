// import { Spinner } from '../../components/Spinner';
import { useEffect, useState } from 'react';
import AddOrderModal from '../orders/modals/AddOrderModal';
import DataTable from './DataTable';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from '../../state-control/store/hooks';
import { fetchAllOrders, selectAllOrders } from '../../state-control/features/orderSlice';
import { AuthUser } from '../../state-control/features/authSlice';


const useStyles = makeStyles({
  addButton: {
    backgroundColor: 'green', // Customize the background color
    color: 'white', // Customize the text color
    '&:hover': {
      backgroundColor: 'darkgreen', // Customize the hover background color
    },
  },
});


const Dashboard = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectAllOrders);
  const [modalIsOpen, setModalOpen] = useState(false); 
  const classes = useStyles(); // Apply the custom styles
  const user = useAppSelector(AuthUser)
  const isAdmin = user.is_staff ?? false



  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllOrders(null));
    } else {
      // Retrieve the userId for the current user from the auth state
      const userId = user.id; // Replace with actual userId retrieval logic
      dispatch(fetchAllOrders(userId));
    }
  }, [dispatch, isAdmin]);

  

  const handleOpenAddModal = () => {
    setModalOpen(true);
  };
  
  return (
    <div>
      <div className="flex justify-end p-5">

        <Button  className={classes.addButton} onClick={handleOpenAddModal}>Add Order</Button>
      </div>
      {orders && orders.length > 0  ? (
        <DataTable
          orders={orders}
        />
      ) : (
        <p className="text-center p-5 border-2 rounded-md border-gray-700">No orders found.</p>
      )}
      <AddOrderModal modalIsOpen={modalIsOpen} setModalOpen={setModalOpen} />
      
      
    </div>
  );
};

export default Dashboard