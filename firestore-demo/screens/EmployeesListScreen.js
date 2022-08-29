import {StyleSheet, View, Text, Button, Alert, Pressable } from "react-native";
import { useState } from "react"

import { db } from "../FirebaseApp"
import { collection, getDocs } from "firebase/firestore";
import { NavigationHelpersContext } from "@react-navigation/native";

const EmployeesListScreen = ({navigation, route}) => {
    
    // state variable
    const [textViewsToRender, setTextViewsToRender] = useState(null)

    const btnGetDataPressed = async () => {
        console.log("Get data button pressed")
        try {
            const querySnapshot = await getDocs(collection(db, "employees"));

            // retreive the documents in the snapshot
            // - an array of documents
            const documents = querySnapshot.docs

            // - loop through the array
            for (let i = 0; i < documents.length; i++) {
                const currDocument = documents[i]
                console.log(`ID: ${currDocument.id}`)
                console.log(currDocument.data())
                console.log("------")
            }

            // generating an array of <Text> elements
            // -  one TextView per document in the collection
            const textViewElementsArray = documents.map((currDoc)=>{
                return (
                    <Button onPress={()=>{btnDetailsPressed(currDoc.id)}} title={currDoc.data().name} key={currDoc.id}/>                    
                )
            })
            console.log(textViewElementsArray)
            // update the state variables
            setTextViewsToRender(textViewElementsArray)

        } catch (err) {
            console.log(`${err.message}`)        
        }

    }

    const btnDetailsPressed = (docId) => {
        console.log(`Button pressed, id: ${docId}`)
        navigation.navigate("EmployeeFormScreen", {employeeId: docId,  isEditing: true})
    }

    const btnAddPressed = () => {
        navigation.navigate("EmployeeFormScreen", {employeeId: "1234", isEditing: false})
    }
    // template
    return(
        <View style={styles.container}>
            <Text style={styles.headingText}>Employees List</Text>
            <Text style={styles.paragraphText}>A list of employees will be displayed here</Text>
            <Button title="ADD EMPLOYEE" onPress={btnAddPressed}/>
            <Button title="GET DATA" onPress={btnGetDataPressed}/>
            { (textViewsToRender === null) && <Text>There is no data in the collection</Text>}
            { (textViewsToRender !== null) && textViewsToRender }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headingText: {
        fontSize:24,
        textAlign:"center"
    },
    paragraphText: {
        marginTop:8,
        marginBottom:8
    }
  });
export default EmployeesListScreen;
