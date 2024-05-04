import { View, Text, TextInput, Touchable, Pressable, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Camera, CameraType } from 'expo-camera';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



type Ingredient = {
    id: string,
    value: string
}


const AddRecipe = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([{
    id: '1',
    value: ''
  }])
  const [instructions, setInstructions] = useState<Ingredient[]>([{
    id: '1',
    value: ''
  }])
  const [title, setTitle] = useState('')

  function add(type: 'ingredient' | 'instruction') {
    if (type === 'ingredient') 
        setIngredients(val => [...val, {id: (Math.round(Math.random() * 1000)).toString(), value: ''}])
    else 
        setInstructions(val => [...val, {id: (Math.round(Math.random() * 1000)).toString(), value: ''}])
  }

  function deleteInput(id: string, type: 'ingredient' | 'instruction') {
    if (type === 'ingredient') 
        setIngredients(val => val.filter(ingredient => ingredient.id !== id))
    else 
        setInstructions(val => val.filter(instruction => instruction.id !== id))
  }

  function handleChange(id: string, value: string, type: 'ingredient' | 'instruction') {
    if (type === 'ingredient') 
        setIngredients(val => val.map(ingredient => ingredient.id === id ? {...ingredient, value} : ingredient))
    else 
        setInstructions(val => val.map(instruction => instruction.id === id ? {...instruction, value} : instruction))
  }

  async function saveRecipe() {
    const recipe = {
        title,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions)
    }
    const recipes = await AsyncStorage.getItem('my_recipes')
    if (recipes) {
        const formattedRecipes = JSON.parse(recipes)
        AsyncStorage.setItem('my_recipes', JSON.stringify([...formattedRecipes, recipe]))
    } else {
        AsyncStorage.setItem('my_recipes', JSON.stringify([recipe]))
    }
    Alert.alert('Success', 'Recipe saved successfully')
  }


  return (
    <View style={{backgroundColor: colors.primary, flex: 1, padding: 20}}>
      <Text>Add your own recipe</Text>
      <Camera style={{height: 200, marginHorizontal: 20, marginTop: 20}} type={CameraType.back} />
      <Text style={{fontSize: 20, color: colors.secondary, marginVertical: 10}}>Title</Text>
      <TextInput placeholderTextColor={colors.secondary} value={title} onChange={(e) => setTitle(e.nativeEvent.text)} placeholder='Enter recipe title' style={{borderStyle: 'solid', marginTop: 10, color: colors.secondary, borderBottomWidth: 1, borderBottomColor: colors.primary}} />
      <Text style={{fontSize: 20, color: colors.secondary, marginVertical: 10}}>Ingredients</Text>
      {ingredients.map((ingredient, index) => (
        <>
            <View key={ingredient.id} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                    <TextInput
                        placeholderTextColor={colors.secondary} 
                        value={ingredient.value} 
                        onChange={(e) => handleChange(ingredient.id, e.nativeEvent.text, 'ingredient')} 
                        key={ingredient.id} placeholder={`Ingredient #${index + 1}...`}
                        style={{borderStyle: 'solid', marginTop: 10, color: colors.secondary, borderBottomWidth: 1, borderBottomColor: colors.primary}} 
                    />
                </View>
                <Entypo name="trash" color={colors.secondary} size={20} onPress={() => deleteInput(ingredient.id, 'ingredient')} />
            </View>
            {index === ingredients.length - 1 && (
                <Pressable onPress={() => add('ingredient')}>
                    <Entypo name="plus" size={30} />
                </Pressable>
            )}
        </>
      ))}
      <View style={{width: '100%', height: 1, backgroundColor: colors.secondary, marginVertical: 20}}></View>
      <Text style={{fontSize: 20, color: colors.secondary, marginBottom: 10}}>Instructions</Text>
      {instructions.map((instruction, index) => (
        <>
            <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                    <TextInput
                        placeholderTextColor={colors.secondary} 
                        value={instruction.value} 
                        onChange={(e) => handleChange(instruction.id, e.nativeEvent.text, 'instruction')} 
                        key={instruction.id} placeholder={`Instruction #${index + 1}...`}
                        style={{borderStyle: 'solid', marginTop: 10, color: colors.secondary, borderBottomWidth: 1, borderBottomColor: colors.primary}} 
                    />
                </View>
                <Entypo name="trash" color={colors.secondary} size={20} onPress={() => deleteInput(instruction.id, 'instruction')} />
            </View>
            {index === instructions.length - 1 && (
                <Pressable onPress={() => add('instruction')}>
                    <Entypo name="plus" size={30} />
                </Pressable>
            )}
        </>
      ))}
      <Button title="Save recipe" onPress={() => saveRecipe()} />
    </View>

  )
}

export default AddRecipe