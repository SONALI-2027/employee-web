import { useState } from 'react'
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination
} from 'react-table';
import axios from 'axios';
import * as React from "react";
import './App.css'

function App() {
  const [employees,setEmployees] = useState([]);
  const columns=React.useMemo(()=>[
    {Header:"EmployeeId",accessor:"employeeId"},
    {Header:"Name",accessor:"name"},
    {Header:"Manager",accessor:"manager"},
    {Header:"Salary",accessor:"salary"},
    {Header:"Edit", id:"Edit", accessor:"edit",
      Cell:props=>(<button className='editbtn' onClick={()=>handleUpdate(props.cell.row.original)}>Edit</button>)
    },
    {Header:"Delete", id:"Delete", accessor:"delete",
      Cell:props=>(<button className='deletebtn' onClick={()=>handleDelete(props.cell.row.original)}>Delete</button>)
    }
  ],[]);
  const data = React.useMemo(() => employees, [employees]);

const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  page,
  prepareRow,
  state,
  pageCount,
  nextPage,
  previousPage,
  canPreviousPage,
  canNextPage,
  gotoPage,
  setGlobalFilter
} = useTable(
  {
    columns,
    data,
    initialState:{pageSize:5}
  },
  useGlobalFilter,
  useSortBy,
  usePagination
);
  const[employeeData,setEmployeeData]=useState({name:"",manager:"",salary:""})
  const [errorMsg,seterrMsg]=useState("");
  const [showCancel,setshowCancel]=useState(false);
  const {globalFilter,pageIndex}=state;
 
  
  const getAllEmployees=()=>{
    axios.get("http://localhost:8086/employees").then((res)=>{
      console.log(res.data);
      setEmployees(res.data);
    });
  }

  const handleChange=(e)=>{
    setEmployeeData({...employeeData,[e.target.name]:e.target.value});
    seterrMsg("");

  } 
  const handleUpdate=(emp)=>{
    setEmployeeData(emp);
    setshowCancel(true);
  }

  const handleDelete=async(emp)=>{
    const isConfirmed=window.confirm("Are you sure you want to delete?");
    if(isConfirmed){
     await axios.delete(`http://localhost:8086/employees/${emp.employeeId}`).then((res)=>{
      console.log(res.data);
      setEmployees(res.data);
    });
    }

    window.location.reload();
    
  }

  const handleCancel=()=>{
    setEmployeeData({name:"",manager:"",salary:""});
    setshowCancel(false);
  }

  const clearAll=()=>{
    setEmployeeData({name:"",manager:"",salary:""});
    getAllEmployees();
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();
    let errorMsg="";
    if(!employeeData.name || !employeeData.manager || !employeeData.salary){
      errorMsg="All fields are required";
      seterrMsg(errorMsg);
    }  
    if((errorMsg.length===0) && employeeData.employeeId){
      await axios.patch(`http://localhost:8086/employees/${employeeData.employeeId}`,employeeData).then((res)=>{
      console.log(res.data);
    });
    }else if(errorMsg.length===0){ 
    await axios.post("http://localhost:8086/employees",employeeData).then((res)=>{
      console.log(res.data);
    });
    }
    
    clearAll();
  }

  React.useEffect(()=>{
    getAllEmployees();
  },[]);

  return (
    <>
      <div className="main-container">
        <h3>Employee-web-app</h3>
        {errorMsg && <span className='err'>{errorMsg}</span>}
        <div className="add-panel">
          <div className="addpaneldiv">
            <label htmlFor="name">Name</label> <br></br>
            <input type="text" id='name' value={employeeData.name} name='name' onChange={handleChange} className='addpanelinput'/>
          </div>
          <div className="addpaneldiv">
            <label htmlFor="manager">Manager</label> <br></br>
            <input type="text" id='manager' name='manager' value={employeeData.manager} onChange={handleChange} className='addpanelinput'/>
          </div>
          <div className="addpaneldiv">
            <label htmlFor="salary">Salary</label> <br></br>
            <input type="text" id='salary' name='salary' value={employeeData.salary} onChange={handleChange} className='addpanelinput'/>
          </div>
          <button className="addbtn" onClick={handleSubmit}>{employeeData.employeeId?"Update":"Add"}</button>
          <button className="cancelbtn" disabled={!showCancel} onClick={handleCancel}>Cancel</button>
           <input className="searchinput" type="search" name='inputsearch' value={globalFilter || ""} onChange={(e)=>setGlobalFilter(e.target.value)} id='inputsearch' placeholder='search employee' />

          <table className="table" {...getTableProps()}>
            <thead>
  {headerGroups.map((hg) => {
    const headerGroupProps = hg.getHeaderGroupProps();

    return (
      <tr key={headerGroupProps.key} {...headerGroupProps}>
        {hg.headers.map((column) => {
          const headerProps = column.getHeaderProps(
            column.getSortByToggleProps()
          );

          return (
            <th key={headerProps.key} {...headerProps}>
              {column.render("Header")}

              <span>
                {column.isSorted
                  ? column.isSortedDesc
                    ? " 🔽"
                    : " 🔼"
                  : ""}
              </span>
            </th>
          );
        })}
      </tr>
    );
  })}
</thead>
            <tbody {...getTableBodyProps()}>
  {page.map((row) => {
    prepareRow(row);

    const rowProps = row.getRowProps();

    return (
      <tr key={rowProps.key} {...rowProps}>
        {row.cells.map((cell) => {
          const cellProps = cell.getCellProps();

          return (
            <td key={cellProps.key} {...cellProps}>
              {cell.render("Cell")}
            </td>
          );
        })}
      </tr>
    );
  })}
</tbody>
          </table>
          <div className="pagediv">
        <button disabled={!canPreviousPage} className='pagebtn' onClick={()=>gotoPage(0)}>First</button>
        <button disabled={!canPreviousPage} className='pagebtn' onClick={previousPage}>Prev</button>
        <span className="idx">{pageIndex+1} of {pageCount}</span>
        <button disabled={!canNextPage} className='pagebtn' onClick={nextPage}>Next</button>
        <button disabled={!canNextPage} className='pagebtn' onClick={()=>gotoPage(pageCount-1)}>Last</button>
      </div>
        </div>
      </div>
      
    </>
  )
}

export default App
