import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const CalendarScreen = ({navigation}) => {

  const [activeDate, setActiveDate] = useState(new Date());

  const generateMatrix = () => {
    const matrix = [];
    matrix[0] = weekDays.map(day => day.substring(0, 3));

    const year = activeDate.getFullYear();
    let month = activeDate.getMonth();
    let firstDay = new Date(year, month, 1).getDay();

    if (firstDay === 0) {
      firstDay = 6;
    } else {
      firstDay -= 1;
    }

    const maxDays = nDays[month];

    if (
      month === 1 &&
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    ) {
      maxDays += 1;
    }

    let counter = 1;
    let rowIndex = 1;
    let colIndex = firstDay;

    for (let i = 1; i < 7; i++) {
      matrix[i] = new Array(7).fill(-1);
    }

    while (counter <= maxDays) {
      matrix[rowIndex][colIndex] = counter;
      counter++;
      colIndex++;

      if (colIndex === 7) {
        colIndex = 0;
        rowIndex++;
      }
    }

    return matrix;
  };

  const matrix = generateMatrix();

  const rows = matrix.map((row, rowIndex) => (
    <View key={rowIndex} style={styles.calendarRow}>
      {row.map((item, colIndex) => (
        <Text
          key={colIndex}
          style={[
            styles.calendarDay,
            {backgroundColor: rowIndex === 0 ? '#ddd' : '#fff'},
            {fontWeight: item === activeDate.getDate() ? 'bold' : 'normal'},
          ]}
          onPress={() => _onPress(item)}>
          {item !== -1 ? item : ''}
        </Text>
      ))}
    </View>
  ));

  const _onPress = item => {
    if (!isNaN(item) && item !== -1) {
      const currentDate = new Date();
      const selectedDate = new Date(
        activeDate.getFullYear(),
        activeDate.getMonth(),
        item,
      );

      if (
        selectedDate >= currentDate ||
        selectedDate.toDateString() === currentDate.toDateString()
      ) {
        const formattedDate = `${selectedDate.getDate()}/${
          selectedDate.getMonth() + 1
        }/${selectedDate.getFullYear()}`;
        Alert.alert('Date is:', formattedDate);
        setActiveDate(prevDate => {
          const newDate = new Date(prevDate);
          newDate.setDate(item);
          return newDate;
        });
      } else {
        Alert.alert('Invalid Date', 'You cannot select past dates.');
      }
    }
  };

  const changeMonth = n => {
    setActiveDate(prevDate => {
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
    <>
      <View style={[styles.container, {}]}>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 346,
          }}>
          <Text style={styles.header}>
            {months[activeDate.getMonth()]} {activeDate.getFullYear()}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              width: 80,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{height: 20}}
              onPress={() => changeMonth(-1)}>
              <Text>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{height: 20}}
              onPress={() => changeMonth(1)}>
              <Text>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {rows}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: 'blue',
          justifyContent: 'center',
          position: 'absolute',
          top: 550,
          width: 45,
          height: 45,
          borderRadius: 100,
          alignItems: 'center',
          alignSelf: 'flex-end',
          right: 20,
        }}
        onPress={()=>{
            navigation.navigate("SwiperComponenet")
        }}
        >
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            lineHeight: 20,
            backgroundColor: 'red',
            textAlign: 'center',
            textAlignVertical: 'center',
            borderRadius: 100,
            width: '100%',
            height: '100%',
          }}>
          +
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
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

export default CalendarScreen;
