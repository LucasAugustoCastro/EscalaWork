import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';

import { StyleSheet, View, Picker } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import {addDays, format} from 'date-fns'

interface DateData {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  dateString: string;
};

export default function App() {
  const [workPeriod, setWorkPeriod] = useState(Number)
  const [restPeriod, setRestPeriod] = useState(Number)
  const [startDate, setStartDate] = useState(new Date())
  const [restDays, setRestDays] = useState({})
  const [selectedLanguage, setSelectedLanguage] = useState('')

  const getRestInfo = () => {
    return {workPeriod:14, restPeriod: 21, startDate:'2022-03-23'}
  }

  const loadRestDays = (
    months: DateData[],
    workPeriod: number,
    restPeriod: number,
    startDate: Date
    ) => {
    // console.log('Mes recebido: ', months)

    // Start logical code
    const allDayRest = Array<Array<Date>>()
    months.forEach((month) => {
      const endDate = new Date(month.year, month.month, 0)

      // allDayRest.push(
      //   Array.from(
      //     { length: restPeriod },
      //     (_, index) => addDays(dayRest, index),
      //     )
      //     )
      //     // console.log("Primeira adicao:  ", allDayRest)

      var dayRest = addDays(startDate, workPeriod)
      // dayRest = addDays(dayRest, workPeriod + (restPeriod -1))
      while (dayRest <= endDate){
          allDayRest.push(
              Array.from(
                  { length: restPeriod},
                  (_, index) => addDays(dayRest, index),
              )
          )
          // console.log("Apos adicionar:  ", allDayRest)
          dayRest = addDays(dayRest, workPeriod + (restPeriod-1))



      }
    })







    // End logical code

    const allPeriod = Object()
    allDayRest.forEach((period) => {
      period.forEach((date, index) => {
        const strDate = format(date, 'yyyy-MM-dd')
        if (index == 0) {
          allPeriod[strDate] = {disabled: true, startingDay: true, color: 'green', textColor:'white'}
        }
        else if (period.length-1 == index){
          allPeriod[strDate] = {disabled: true, endingDay: true, color: 'green', textColor:'white'}
        }
        else {
          allPeriod[strDate] = {disabled: true, color: 'green', textColor:'white'}
        }
      })
    })




    setRestDays(
      {
        ...restDays,
        ...allPeriod
      }
    )

    // console.log(restDays)
    // console.log(workPeriod
    //   ,restPeriod
    //   ,startDate)
    // const {} = getRestInfo()

  }

  useEffect(() => {
    const restInfo = getRestInfo()
    setWorkPeriod(restInfo.workPeriod)
    setRestPeriod(restInfo.restPeriod)
    setStartDate(new Date(restInfo.startDate))
    console.log('Yeey')

  }, [])

  return (
    <View style={styles.container} >

      <Picker
        selectedValue={selectedLanguage}
        style={{ height: 200, width: 150 }}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
      >
        {[...Array(100).keys()].map((item) => (
          <Picker.Item key={item} label={item.toString()} value={item.toString()} />

        ))}

      </Picker>
      <CalendarList
        // Callback which gets executed when visible months change in scroll view. Default = undefined
        onVisibleMonthsChange={(months) => {
          loadRestDays(months, workPeriod, restPeriod, startDate)}
        }
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={3}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={20}
        // Enable or disable scrolling of calendar list
        scrollEnabled={true}
        // Enable or disable vertical scroll indicator. Default = false
        showScrollIndicator={true}

        markingType={'period'}
        markedDates={restDays}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
