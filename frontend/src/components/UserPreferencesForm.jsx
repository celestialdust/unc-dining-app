import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['Personal Information', 'Dietary Restrictions', 'Nutrition Goals', 'Activity Level'];

export default function UserPreferencesForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    dietaryRestrictions: [],
    nutritionGoals: '',
    activityLevel: 3,
  });
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      dietaryRestrictions: checked
        ? [...prevData.dietaryRestrictions, name]
        : prevData.dietaryRestrictions.filter((item) => item !== name),
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/preferences', formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting preferences:', error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
            <TextField
              required
              name="height"
              label="Height (cm)"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="weight"
              label="Weight (kg)"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
            />
            <TextField
              required
              name="age"
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
            />
          </Box>
        );
      case 1:
        return (
          <FormGroup>
            <FormControlLabel
              control={<Checkbox onChange={handleCheckboxChange} name="vegetarian" />}
              label="Vegetarian"
            />
            <FormControlLabel
              control={<Checkbox onChange={handleCheckboxChange} name="vegan" />}
              label="Vegan"
            />
            <FormControlLabel
              control={<Checkbox onChange={handleCheckboxChange} name="glutenFree" />}
              label="Gluten-free"
            />
            <FormControlLabel
              control={<Checkbox onChange={handleCheckboxChange} name="lactoseIntolerant" />}
              label="Lactose Intolerant"
            />
          </FormGroup>
        );
      case 2:
        return (
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="nutrition-goals"
              name="nutritionGoals"
              value={formData.nutritionGoals}
              onChange={handleInputChange}
            >
              <FormControlLabel value="weightLoss" control={<Radio />} label="Weight Loss" />
              <FormControlLabel value="muscleGain" control={<Radio />} label="Muscle Gain" />
              <FormControlLabel value="maintenance" control={<Radio />} label="Maintenance" />
              <FormControlLabel value="healthyEating" control={<Radio />} label="Healthy Eating" />
            </RadioGroup>
          </FormControl>
        );
      case 3:
        return (
          <Box sx={{ width: 300 }}>
            <Typography id="activity-level-slider" gutterBottom>
              Activity Level
            </Typography>
            <Slider
              aria-labelledby="activity-level-slider"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              step={1}
              marks
              min={1}
              max={5}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => {
                const labels = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'];
                return labels[value - 1];
              }}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        User Preferences
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent(activeStep)}
        </motion.div>
      </AnimatePresence>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
}