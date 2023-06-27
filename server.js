const Parse = require('parse/node');
const ZKLib = require('./node_modules/node-zklib');

// Initialize Parse Server
Parse.initialize('rWgoIHHJsykVfTI3NC8dBpcrGD4QfxKDfaHx9ZyE', 'eJWB1Fy9wphqCJx7HtUCpeSz9g7cEVC4sfBKg6qH','iFTgkMtPtxI4ksnGWXc9KBX9VTkvlI2YbpmJ3yDM');

Parse.serverURL = 'https://parseapi.back4app.com';
// Parse.User.enableUnsafeCurrentUser();

async function start() {
  let zkInstance = new ZKLib('192.168.10.8', 4370, 10000, 4000);
  let previousAttendancesLength = 0;
  

  try {
    // Create the socket connection
    await zkInstance.createSocket();

    const getInfos = await zkInstance.getInfo();

    console.log(getInfos);
    previousAttendancesLength = getInfos.logCounts;
    console.log(`${previousAttendancesLength} ========infos`);
    
    const users = await zkInstance.getUsers();
    // const unlockdoor = await  zkInstance.executeCmd(32, '')
    // unlockdoor
    // console.log(unlockdoor);
   



    

    // Store users in Parse Server (if not already stored)
    for (const user of users.data) {
      const Person = Parse.Object.extend('Person');
      const query = new Parse.Query(Person);
      query.equalTo('userId', user.userId);
      const existingUser = await query.first('userId');

      if (!existingUser) {
        const newPerson = new Person();
        newPerson.set('userId', user.userId);
        newPerson.set('username', user.name);
        newPerson.set('cardno', user.cardno);
        // newUser.set('password', user.password)
        await newPerson.save();
      } 
    }

    setInterval(async () => {
      
      try {
        const attendances = await zkInstance.getAttendances();
        let currentAttendancesLength = attendances.data.length;
        if (currentAttendancesLength < previousAttendancesLength) {
          currentAttendancesLength = previousAttendancesLength
        }else{
          currentAttendancesLength = attendances.data.length;
        }
        const difference = currentAttendancesLength - previousAttendancesLength; 
    
        previousAttendancesLength = currentAttendancesLength;
        console.log(`${previousAttendancesLength} ========Current`);

        let updatedLog = [];

        if (difference === 0) {
        
          updatedLog = attendances.data.slice(currentAttendancesLength);

        

        }else{
          updatedLog = attendances.data.slice(-difference);
          const AttendanceLog = Parse.Object.extend('AttendanceLog');

          for (const log of updatedLog) {
            const attendance = new AttendanceLog();
            attendance.set('deviceUserId', log.deviceUserId);
            attendance.set('recordTime', log.recordTime);
            await attendance.save();
          }
          
        }

        console.log(updatedLog);
        

      } catch (e) {
        console.log(e);
      }
    }, 180000);
  } catch (error) {
    console.log(error);
  }
}
start();





























































//  const ZKLib = require('./node_modules/node-zklib');
//  //const pointeuse = require('./config');

 

//  async function start() {
//   let zkInstance = new ZKLib('192.168.10.8', 4370, 10000, 4000);
//   let previousAttendancesLength = 0; 

//   try {
//     await zkInstance.createSocket();
//     Users=await zkInstance.getUsers()
      

//   } catch (e) {
//     console.log(e);
//   }

//   setInterval(async () => {
//     try {
//       const attendances = await zkInstance.getAttendances();
//      const currentAttendancesLength = attendances.data.length;
//       const difference = currentAttendancesLength - previousAttendancesLength;
      
//       previousAttendancesLength = currentAttendancesLength;
//      //console.log(difference);
//       if (difference === 0) {
//         updatedlog =[]
        
//       } else {
//         updatedlog =attendances.data.slice(-difference)
//         // console.log(updatedlog);
        
//       }
    
//       // const lastLogs= attendances.data.slice(-20);
//       // const usersData = users.data
  
//       // const getInfoUsers = usersData.map(obj => ({
//       //   userId: obj.userId,
//       //   name: obj.name,
//       //   cardno: obj.cardno
//       // }));
//       // const getInfologs = updatedlog.map(obj => ({
//       //   deviceUserId: obj.deviceUserId,
//       //   recordDate: obj.recordTime.toLocaleDateString(),
//       //   recordTime: obj.recordTime.toLocaleTimeString()
//       // }));
  
     
     
    
//     // const getAllInfos = getInfologs.map(attendance => {
//     //   const { deviceUserId, recordDate, recordTime } = attendance;
//     //   const user = getInfoUsers.find(user => user.userId === deviceUserId);
    
//     return updatedlog;
//   //{
//   //       userId: deviceUserId,
//   //       name: user ? user.name : '',
//   //       cardno: user ? user.cardno : 0,
//   //       recordDate,
//   //       recordTime
//   //     };
//   //   });
//   //  console.log(getAllInfos);  
    

  
      
//   //   } catch (e) {
//   //     console.log(e);
//   //     if (e.code === 'EADDRINUSE') {
//   //       // Handle the error if needed
//   //     }
//   //   }
//   }catch (error){
//     console.log(error);
//   }
// }, 30000);
 

//       //     const attendances = await zkInstance.getAttendances();
//   //     const currentAttendancesLength = attendances.data.length;
//   //     const difference = currentAttendancesLength - previousAttendancesLength;
      
//   //     previousAttendancesLength = currentAttendancesLength;
//   //     console.log(difference);
//   //     if (difference <= 0) {
     
//   //       console.log("no new data")
//   //     } else {
//   //       updatedlog =attendances.data.slice(-difference)
//   //       console.log(updatedlog);
        
//   //     }
    
//     // console.log(users.data)
//     // console.log(users.data[1].userId)
//     // console.log(users.data[1].name)
// //     const users = await zkInstance.getUsers()
// //     const attendances = await zkInstance.getAttendances();
// //     const lastLogs= attendances.data.slice(-20);
// //     const usersData = users.data

// //     const getInfoUsers = usersData.map(obj => ({
// //       userId: obj.userId,
// //       name: obj.name,
// //       cardno: obj.cardno
// //     }));
// //     const getInfologs = lastLogs.map(obj => ({
// //       deviceUserId: obj.deviceUserId,
// //       recordDate: obj.recordTime.toLocaleDateString(),
// //       recordTime: obj.recordTime.toLocaleTimeString()
// //     }));

   
   
  
// //   const getAllInfos = getInfologs.map(attendance => {
// //     const { deviceUserId, recordDate, recordTime } = attendance;
// //     const user = getInfoUsers.find(user => user.userId === deviceUserId);
  
// //     return {
// //       userId: deviceUserId,
// //       name: user ? user.name : '',
// //       cardno: user ? user.cardno : 0,
// //       recordDate,
// //       recordTime
// //     };
// //   });
// // console.log(getAllInfos);  
// };

  



// getUsersWithId();
