import React, { Component } from 'react'
import { TextInput,Modal,Dimensions, Keyboard, Text, TouchableOpacity,FlatList, View, StyleSheet,  ScrollView, Image, Button, Animated } from 'react-native'
import {connect, dispatch} from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import uuid from 'react-native-uuid'


class Comments extends Component {
    constructor(props){
        super(props)
        this.params = this.props.route.params
    }
    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
      }
    
      componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
      }
      state={
        commentText:'',
        keyboardHeight:new Animated.Value(20)
        }
        //when your translating y and if your going from bottom up it should be a negative value. 
    handleKeyboardDidShow = (event) =>{
        console.log("Keyboard called")
        Animated.timing(this.state.keyboardHeight, {
            duration: 0,
            toValue: -1*(event.endCoordinates.height-30),
            useNativeDriver: true,
        }).start();
        // this.setState({keyboardHeight:event.endCoordinates.height})
        // console.log("just seen thsdfdsfe keyboard dawg")
    }
    buttonPressed = () =>{
        if(this.state.commentText!=''){
            console.log(this.params)
            var commentInfo= {
                commentText:this.state.commentText,
                pictureId:this.params.picture.item.id,
                id:uuid.v1(),
                liked:false
            }
            this.props.addComment(commentInfo)
            this.props.navigation.goBack()
        }
    }
    render(){
        // const { params } = this.props.navigation.state;
        // const addComment = params ? params.addComment : null;
        //you need to use animated view since both the text height and the location of the input field should change in parallel. Otherwise location of input field has to wait for text to finish.
        return (
            <Animated.View style={[styles.container, { transform: [{translateY: this.state.keyboardHeight}] }]}>
                <TextInput style={styles.input} multiline={true} placeholder = "Add a comment..." onChangeText={(text) => {this.setState({commentText:text})}}/>
                <View style={styles.postButton}>
                    <TouchableOpacity onPress = {this.buttonPressed.bind(this)}>
                        <Text style={{color:'rgb(122, 136, 204)'}}>Post</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create ({
    input:{
        width:'90%'
    },
    container:{
        borderRadius:5,
        borderWidth:1,
        flexDirection:'row',
        position:'absolute',
        width:'100%',
        bottom:50
    },
    postButton:{
        // position:'absolute',
        // right:0,
        color:'rgb(122,136,204)',
        flexDirection:'column',
        justifyContent:'center'
    }
})

function mapDispatchToProps(dispatch){
    return {
       addComment: (commentInfo) => {
        dispatch({type:'ADD_COMMENT',payload:commentInfo})
        console.log(commentInfo)
        }
    }
 }


 export default connect(null,mapDispatchToProps)(Comments)