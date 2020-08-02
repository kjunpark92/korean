//This API request is not being used anywhere right now, but keeping it as an example of a working request

// import axios from "axios";
// import { fetchDataRequest, fetchDataSuccess, fetchDataError} from "./action";

// export function fetchUsers() {
//   return dispatch => {
//     dispatch(fetchDataRequest());
//     const headers = {
//       'Content-Type': 'application/json',
//     } 

//     axios
//       .post('https://kiipgrammar.com/backend/getUserInformation.php', '', headers)
//       .then(response => {
//         dispatch(fetchDataSuccess(response.data));
//       })
//       .catch(error => {
//         dispatch(fetchDataError(error));
//       });
//   };
// }

