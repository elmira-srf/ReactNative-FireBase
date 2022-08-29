import {StyleSheet, View, Text, TextInput, Switch, Button, Alert, Platform, ScrollView, SafeAreaView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react"

import { db } from "../FirebaseApp"
import { collection, addDoc, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore" 

import { StackActions } from '@react-navigation/native';

const EmployeeFormScreen = ({navigation, route}) => {

    // url parameters
    const {employeeId, isEditing } = route.params

    // state variables
    // - form fields
    const [nameFromUI, setNameFromUI] = useState("")
    const [emailFromUI, setEmailFromUI] = useState("")
    const [cityFromUI, setCityFromUI] = useState("")
    const [hourlyRateFromUI, setHourlyRateFromUI] = useState("")
    const [deptFromUI, setDeptFromUI] = useState("")
    const [isManagerFromUI, setIsManagerFromUI] = useState(false)

    // 1. create state variables to hold the programatically generated buttons
    const [ buttonsToRender, setButtonsToRender ] = useState()

    // lifecycle functions
    useEffect(()=> {     
        
        if (isEditing === true) {
            console.log("User is trying to edit an employee, so HIDE The Add button")

            // 2. set the buttons state variable to be the update /delete button
            setButtonsToRender(
                <View>
                    <Button title="Update Existing Employee" onPress={btnUpdatePressed} />
                    <Button title="Delete Employee" onPress={btnDeletePressed} />
                </View>
            )
        }
        else {

            console.log("User is trying to add an employee, so HIDE The Update/Delete button")
            // 2. set the buttons state variale to be add button
            setButtonsToRender( <Button title="Add Employee" onPress={btnAddPressed} />)
        }

        console.log(`The form screen received: ${employeeId}`) 
        console.log("Retrieving the document from firestore")
        // helper function to retrieve a single document from Firestore
        getDocumentFromFirestore()
        
    },[])

    // helper function to retrieve a single document from Firestore
    const getDocumentFromFirestore = async () => {

        // db = the Firestore database variable, 
        // "employees" = name of collection to retrieve data from, 
        // employeeId = document id of the employee you want
        const docRef = doc(db, "employees", employeeId);
        
        try {
            // getDoc() = attempts to retrieve the specified document
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());

                const employeeData = docSnap.data()

                // update all state variables with employee info
                setNameFromUI(employeeData.name)
                setEmailFromUI(employeeData.email)
                setCityFromUI(employeeData.city)
                setHourlyRateFromUI(employeeData.hourlyRate)
                setDeptFromUI(employeeData.dept)
                setIsManagerFromUI(employeeData.isManager)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        } catch( err) {
            console.log(err.message)
        }
    }


    // event handlers
    // detect when the drop down menu item changes
    const pickerValueChanged = (selectedItem, selectedPosition) => {        
        setDeptFromUI(selectedItem)
    }
    // detect when the switch changes
    const switchValueChanged = (switchValue) => {        
        setIsManagerFromUI(switchValue)
    }
    // button click handlers
    const btnAddPressed =  async () => {
        console.log("Add button pressed")

        try {
            const employeeToInsert = {
                name:nameFromUI,
                email:emailFromUI,
                city:cityFromUI, 
                hourlyRate:parseFloat(hourlyRateFromUI),   // double
                dept:deptFromUI,
                isManager:isManagerFromUI                   // boolean
            }
           const insertedDocument =  await addDoc(collection(db, "employees"), employeeToInsert)
           console.log(`Document created, id is: ${insertedDocument.id}`)
        }
        catch (err) {
            console.log(`${err.message}`)
        }
    }

    const btnDeletePressed = async () => {
        console.log("Deleting employee")
        try {
            await deleteDoc(doc(db, "employees", employeeId));   
            console.log("Delete success")
            // after deletion, return the user to the first screen of the app
            navigation.dispatch(StackActions.popToTop());
        } catch (err) {
            console.log(err.message)
        }
    }
    const btnUpdatePressed = async () => {
        console.log("Updating employee")
        const documentToUpdate = doc(db, "employees", employeeId);
        const updatedEmployeeData = {
            name:nameFromUI,
            email:emailFromUI,
            city:cityFromUI, 
            hourlyRate:parseFloat(hourlyRateFromUI),   // double
            dept:deptFromUI,
            isManager:isManagerFromUI                   // boolean
        }

        try {            
            await updateDoc(documentToUpdate, updatedEmployeeData);
            console.log("Update success")
            
        } catch (err) {
            console.log(err.message)
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>            
                <Text style={styles.headingText}>Employee Screen</Text>
                <Text style={styles.paragraphText}>Enter information about the employee</Text>
                {/* form fields */}
                <TextInput placeholder="Enter the name" style={styles.inputBox} value={nameFromUI} onChangeText={setNameFromUI}/>
                <TextInput placeholder="Enter the email" style={styles.inputBox} value={emailFromUI} onChangeText={setEmailFromUI}/>
                <TextInput placeholder="Enter the city" style={styles.inputBox} value={cityFromUI} onChangeText={setCityFromUI}/>            
                <TextInput placeholder="Enter the hourly rate" style={styles.inputBox} value={hourlyRateFromUI} onChangeText={setHourlyRateFromUI}/>
                <Text style={styles.paragraphText}>Choose a dept:</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={deptFromUI}
                    onValueChange={pickerValueChanged}>
                    <Picker.Item label="Accounting" value="accounting" />
                    <Picker.Item label="Customer Support" value="customer-support" />
                    <Picker.Item label="Technology" value="technology" />
                    <Picker.Item label="Sales" value="sales" />                
                </Picker>         
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={styles.paragraphText}>Is this employee a manager?</Text>            
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={ (isManagerFromUI === true) ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={switchValueChanged}
                        value={isManagerFromUI}
                    />
                </View>
                {/* end form fields */}

                {/* buttons for the screen */}

                {/* inline if && function} */}

                {/* // show the buttons in the staste variable */}
                { buttonsToRender }
               
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {      
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',      
    },
    headingText: {
        fontSize:24,
        textAlign:"center"
    },
    paragraphText: {
        marginTop:8,
        marginBottom:8
    },
    inputBox: {        
        height:50,        
        borderWidth:1,
        borderColor:"#888",
        padding:10,
        marginBottom:10
    },
    picker: {
        height:(Platform.OS === 'ios') ? 0 : 50,
        marginTop:10,
        marginBottom: (Platform.OS === 'ios') ? 200 : 10
    }
  });
export default EmployeeFormScreen;
