import { makeStyles } from '@material-ui/core/styles';
import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@material-ui/core';
import { OrderType } from '../../types/models';
import EditOrderModal from '../orders/modals/EditOrderModal';
import ViewOrderModal from '../orders/modals/ViewOrderModal';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { deleteOrder, fetchAllOrders, fetchOrderById } from '../../state-control/features/orderSlice';
import { useAppDispatch } from '../../state-control/store/hooks';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  
});

interface DataTableProps {
  orders: OrderType[];  
}

const DataTable: React.FC<DataTableProps> = ({
  orders
}) => {
  const classes = useStyles();
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [viewModalIsOpen, setViewModalOpen] = useState(false);
  const dispatch = useAppDispatch()

  const handleEditModal = async (id: string, e:any) => {
    e.preventDefault
		setShowEditOrderModal((prevState) => !prevState);
		await dispatch(fetchOrderById(id)).unwrap();
	};

	//handle delete
  const handleDelete =   (id:string, e:any) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
          const submitResponse = await dispatch(deleteOrder(id)).unwrap();
          if(submitResponse.hasOwnProperty('success') && submitResponse.success === true ){
             dispatch(fetchAllOrders()); 
            Swal.fire({
              position: 'top-end',
              title: 'Content Successfully Deleted',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            })                  

          }else{
            let errorResponses = [];
            for (const key in submitResponse.errors) {
              errorResponses.push(submitResponse.errors[key]); 
            }
          }
        } catch (err) {
            console.log(err);
        }
      }
    })

}
  const handleViewModal = async (id: string, e:any) => {
    e.preventDefault();    
		setViewModalOpen((prevState) => !prevState);
		await dispatch(fetchOrderById(id)).unwrap();
	};



  return (
    <>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>S/N</TableCell>
            {/* <TableCell>ID</TableCell> */}
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Spicyness</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, idx = 0) => (
            <TableRow key={order.id_}>
              <TableCell>{idx + 1}</TableCell>
              {/* <TableCell>{order.id_}</TableCell> */}
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{order.status && order.status.value}</TableCell>
              <TableCell>{order.spicyness && order.spicyness.value}</TableCell>
              <TableCell>
                <div className={classes.actions}>
                  <Button variant="outlined" color="primary" onClick={(e) => handleViewModal(order.id_, e)}>
                    View
                  </Button>
                  <Button variant="outlined" color="primary" onClick={(e) => handleEditModal(order.id_, e)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={(e) => handleDelete(order.id_, e)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ViewOrderModal
        viewModalIsOpen={viewModalIsOpen}       
        setViewModalOpen={setViewModalOpen}
      />
      <EditOrderModal
        editModalIsOpen={showEditOrderModal}       
        setEditModalOpen={setShowEditOrderModal}
      />
    </>

  );
};

export default DataTable;
