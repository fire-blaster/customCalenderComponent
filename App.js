import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const App = () => {
  const [activeDate, setActiveDate] = useState(new Date());
  const generateMatrix = () => {
    const matrix = [];
    matrix[0] = weekDays.map((day) => day.substring(0, 3));
  
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();
    const today = activeDate.getDate();
  
    const firstDay = new Date(year, month, 1).getDay();
  
    if (firstDay === 0) {
      firstDay = 6;
    } else {
      firstDay -= 1;
    }
  
    const maxDays = nDays[month];
  
    if (month === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
      maxDays += 1;
    }
  
    let counter = 1;
    let rowIndex = 1;
    let colIndex = firstDay;
  
    while (counter <= maxDays) {
      if (!matrix[rowIndex]) {
        matrix[rowIndex] = [];
      }
      if (rowIndex === 1 && colIndex < today) {
        matrix[rowIndex][colIndex] = -1; // Disable dates before today
      } else {
        matrix[rowIndex][colIndex] = counter;
        colIndex++;
        if (colIndex === 7) {
          colIndex = 0;
          rowIndex++;
        }
        counter++;
      }
    }
  
    if (firstDay !== 0) {
      for (let i = 0; i < firstDay; i++) {
        matrix[1].unshift(-1);
      }
    }
  
    const lastRow = matrix[matrix.length - 1];
    if (lastRow.length < 7) {
      const remainingDays = 7 - lastRow.length;
      for (let i = 0; i < remainingDays; i++) {
        lastRow.push(-1);
      }
    }
  
    return matrix;
  };
  
  // const generateMatrix = () => {
  //   const matrix = [];
  //   matrix[0] = weekDays.map(day => day.substring(0, 3));

  //   const year = activeDate.getFullYear();
  //   let month = activeDate.getMonth();
  //   let firstDay = new Date(year, month, 1).getDay();

  //   if (firstDay === 0) {
  //     firstDay = 6;
  //   } else {
  //     firstDay -= 1;
  //   }

  //   const maxDays = nDays[month];

  //   if (month === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
  //     maxDays += 1;
  //   }

  //   let counter = 1;
  //   let rowIndex = 1;
  //   let colIndex = firstDay;

  //   while (counter <= maxDays) {
  //     if (!matrix[rowIndex]) {
  //       matrix[rowIndex] = [];
  //     }
  //     matrix[rowIndex][colIndex] = counter;
  //     colIndex++;
  //     if (colIndex === 7) {
  //       colIndex = 0;
  //       rowIndex++;
  //     }
  //     counter++;
  //   }

  //   if (firstDay !== 0) {
  //     for (let i = 0; i < firstDay; i++) {
  //       matrix[1].unshift(-1);
  //     }
  //   }

  //   const lastRow = matrix[matrix.length - 1];
  //   if (lastRow.length < 7) {
  //     const remainingDays = 7 - lastRow.length;
  //     for (let i = 0; i < remainingDays; i++) {
  //       lastRow.push(-1);
  //     }
  //   }

  //   return matrix;
  // };

  const matrix = generateMatrix();

  const rows = matrix.map((row, rowIndex) => (
    <View key={rowIndex} style={styles.calendarRow}>
      {row.map((item, colIndex) => (
        <Text
          key={colIndex}
          style={[
            styles.calendarDay,
            { backgroundColor: rowIndex === 0 ? '#ddd' : '#fff' },
            { fontWeight: item === activeDate.getDate() ? 'bold' : 'normal' }
          ]}
          onPress={() => _onPress(item)}
        >
          {item !== -1 ? item : ''}
        </Text>
      ))}

    </View>
  ));

  // const _onPress = (item) => {
  //   setActiveDate((prevDate) => {
  //     if (!isNaN(item) && item !== -1) {
  //       Alert.alert("Date is:", String(item));
  //       const newDate = new Date(prevDate);
  //       newDate.setDate(item - 1);
  //       return newDate;
  //     }
  //     return prevDate;
  //   });
  // };

  const _onPress = (item) => {
    if (!isNaN(item) && item !== -1) {
      const selectedDate = new Date(activeDate.getFullYear(), activeDate.getMonth(), item);
      const currentDate = new Date();
      if (selectedDate <= currentDate) {
        const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
        Alert.alert("Date is:", formattedDate);
        setActiveDate((prevDate) => {
          const newDate = new Date(prevDate);
          newDate.setDate(item);
          return newDate;
        });
      } else {
        Alert.alert("Invalid Date", "You cannot select future dates.");
      }
    }
  };
  
  

  const changeMonth = (n) => {
    setActiveDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + n);

      if (newDate.getDay() === 0) {
        newDate.setDate(newDate.getDate() - 6); 
      } else {
        newDate.setDate(newDate.getDate() - (newDate.getDay() - 1));
      }

      return newDate;
    });
  };

  return (
    <View style={[styles.container, {}]}>
      <View style={{
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        width: 346
      }}>

        <Text style={styles.header}>
          {months[activeDate.getMonth()]} {activeDate.getFullYear()}
        </Text>
        <View style={{
          flexDirection: "row",
          width: 80,
          justifyContent: "space-between"
        }}>
          <TouchableOpacity style={{ height: 20 }} onPress={() => changeMonth(-1)}>
            <Text>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 20 }} onPress={() => changeMonth(1)}>
            <Text>{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {rows}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  calendarDay: {
    flex: 1,
    height: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default App;
