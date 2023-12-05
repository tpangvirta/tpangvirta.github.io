$(document).ready(function() {

  // When clicking the submit button
  $('#wf-form-Virta-Results-Calculator').submit(function() {
		// The value from the inputs
    let firstNameData = $('#first-name').val();
    let lastNameData = $('#last-name').val();
    let emailAddressData = $('#email-address').val();
    let weightData = $('#weight').val();
    let feetData = $('#height-feet').val();
    let inchesData = $('#height-inches').val();
    let hba1cData = $('#hba1c').val();
    let employerData = $('#employer').val();
		const checkBoxInsulin = $("#checkbox-insulin").is(":checked");
    const checkBoxSulfonylureas = $("#checkbox-sulfonylureas").is(":checked");
    const checkBoxGlp1 = $("#checkbox-glp1").is(":checked");
    const checkBoxSglt2 = $("#checkbox-sglt2").is(":checked");
    const checkBoxDpp4 = $("#checkbox-dpp4").is(":checked");
    const checkBoxTzd = $("#checkbox-tzd").is(":checked");
    const checkBoxNone = $("#checkbox-none").is(":checked");
    const checkBoxA1C = $("#checkbox-a1c").is(":checked");
    
    const checkboxValsData = [
       checkBoxInsulin,
       checkBoxSulfonylureas,
       checkBoxGlp1,
       checkBoxSglt2,
       checkBoxDpp4,
       checkBoxTzd,
       checkBoxNone
    ];
		
    localStorage.clear();
    
	// Storing the values in localStorage
    localStorage.setItem('first-name', firstNameData);
    localStorage.setItem('email-address', emailAddressData);
		localStorage.setItem('last-name', lastNameData);
    localStorage.setItem('weight', weightData);
    localStorage.setItem('height-feet', feetData);
    localStorage.setItem('height-inches', inchesData);
    localStorage.setItem('hba1c', hba1cData);
    localStorage.setItem('employer', employerData);
		localStorage.setItem("checkboxVals", checkboxValsData);    

	// Log it to the console
	// console.log(firstNameData, emailAddressData);

  // Scroll to top
  $('.modal-overlay').animate({ scrollTop: 0 }, 'slow');


// Results code starts here

const checkboxVals = localStorage
    .getItem("checkboxVals")
    .split(",")
    .map((val) => val === "true");
  const [
    includeInsulin,
    includeSulfonylurea,
    includeGlp1,
    includeSglt2,
    includeDpp4,
    includeTzd,
    includeNone,
  ] = checkboxVals;

  const replaceTagWithText = (elementId, tag, replacement) => {
    const element = $(elementId);
    const textToReplace = element.html();
    const newText = textToReplace.replaceAll(tag, replacement);
    element.html(newText);
  };

  const roundToTenths = (val) => Math.round(val * 10) / 10;

  const calculateA1cReduction = (a1c) => {
    if (a1c > 12.0) {
      return 5.7;
    } else if (a1c > 10.0 && a1c <= 12.0) {
      return 3.4;
    } else if (a1c > 8.5 && a1c <= 10.0) {
      return 1.9;
    } else if (a1c > 7.5 && a1c <= 8.5) {
      return 1.2;
    } else if (a1c > 6.5 && a1c <= 7.5) {
      return 0.7;
    } else if (a1c > 5.6 && a1c <= 6.5) {
      return 0.3;
    } else {
      return 0;
    }
  };

  const calculateBmi = (weight, heightFeet, heightInches) => {
    const totalHeightInches = heightFeet * 12 + heightInches;
    const bmi = roundToTenths(
      (703 * weight) / (totalHeightInches * totalHeightInches)
    );
    return bmi;
  };

  const calculateWeightReduction = (
    weight,
    heightFeet,
    heightInches
  ) => {
    const bmi = calculateBmi(weight, heightFeet, heightInches);
    if (bmi > 39.9) {
      // Obesity Extreme
      weight_reduction_perc = 0.063;
    } else if (bmi > 34.9) {
      // Obesity Class 2
      weight_reduction_perc = 0.062;
    } else if (bmi > 29.9) {
      // Obesity Class 1
      weight_reduction_perc = 0.058;
    } else if (bmi > 24.9) {
      // Overweight
      weight_reduction_perc = 0.049;
    } else if (bmi > 18.4) {
      // Normal
      weight_reduction_perc = 0.031;
    } else {
      // Underweight
      weight_reduction_perc = 0.0; /* Let’s not populate animation */
    }
    return weight_reduction_perc;
  };

  // Hide or show divs based on BMI value
  const determineBmiRange = (
    weight,
    heightFeet,
    heightInches
  ) => {
    const bmiHealth = calculateBmi(weight, heightFeet, heightInches);
    console.log('BMI:', bmiHealth); // Log the BMI value to the console
    if (bmiHealth <= 18.4) {
      $("#weight-default").hide();
      $("#weight-alt").show();
    } else {
      $("#weight-alt").hide();
      $("#weight-default").show();
    }
  };

  const calculateCostSavings = (
    includeInsulin,
    includeSulfonylurea,
    includeGlp1,
    includeSglt2,
    includeDpp4,
    includeTzd,
    includeNone
  ) => {
    let costSavings = 0;
    if (includeNone) {
      return costSavings;
    }
    if (includeInsulin) {
      costSavings += 420;
    }
    if (includeSulfonylurea) {
      costSavings += 71;
    }
    if (includeGlp1) {
      costSavings += 2206;
    }
    if (includeSglt2) {
      costSavings += 1493;
    }
    if (includeDpp4) {
      costSavings += 1375;
    }
    if (includeTzd) {
      costSavings += 136;
    }
    return costSavings;
  };

  const hideMedicationDivs = (
    includeInsulin,
    includeSulfonylurea,
    includeGlp1,
    includeSglt2,
    includeDpp4,
    includeTzd,
    includeNone,
  ) => {
    let section;
    
    // Check if none of the checkboxes are checked
    const noneChecked = !(
      includeInsulin ||
      includeSulfonylurea ||
      includeGlp1 ||
      includeSglt2 ||
      includeDpp4 ||
      includeTzd ||
      includeNone
    );

    if (noneChecked) {
      // Hide entire medications section
      section = $("#med-reductions");
      section.hide();
      return;
    }
    
    if (includeNone) {
      // Hide entire medications section
      section = $("#med-reductions");
      section.hide();
      return;
    }
    if (!includeInsulin) {
      section = $("#insulin-reduction");
      section.hide();
    }
    if (!includeSulfonylurea) {
      section = $("#sulfonylurea-reduction");
      section.hide();
    }
    if (!includeGlp1) {
      section = $("#glp1-reduction");
      section.hide();
    }
    if (!includeSglt2) {
      section = $("#sglt2-reduction");
      section.hide();
    }
    if (!includeDpp4) {
      section = $("#dpp4-reduction");
      section.hide();
    }
    if (!includeTzd) {
      section = $("#tzd-reduction");
      section.hide();
    }
  };

  // Hide or show results based on the presence of data in the #hba1c form field
  if ($('#hba1c').val()) {
    $("#no-a1c").hide();
    $("#yes-a1c").show();
  } else {
    $("#yes-a1c").hide();
    $("#no-a1c").show();
  }
  
  // Entering the localStorage value in each input
  const firstName = localStorage.getItem("first-name");
  const emailAddress = $("#emailAddress").val(
    localStorage.getItem("email-address")
  );
  const lastName = localStorage.getItem("last-name");
  const weight = parseFloat(localStorage.getItem("weight"));
  const feet = parseInt(localStorage.getItem("height-feet"));
  const inches = parseInt(localStorage.getItem("height-inches"));
  const hba1c = parseFloat(localStorage.getItem("hba1c"));
  const employer = localStorage.getItem("employer");

  const weightReductionProportion = calculateWeightReduction(
    weight,
    feet,
    inches
  );
  
  const weightReductionPercentage = roundToTenths(
    parseFloat(weightReductionProportion * 100)
  );
  
  const weightReduction = roundToTenths(weightReductionProportion * weight);
  const potentialWeight = Math.round(weight - weightReduction);
  const a1cReduction = calculateA1cReduction(hba1c);
  const potentialHba1c = roundToTenths(hba1c - a1cReduction);
  const belowThreshold = "";
  const costSavings = calculateCostSavings(...checkboxVals);

	// Show/Hide weight divs based on BMI
  determineBmiRange(weight, feet, inches);

  // Show/Hide medication sections based on checkbox values
  hideMedicationDivs(...checkboxVals);

  // Replacing tags with their dynamic values from the forms/calculations
  replaceTagWithText("#prediction-heading", "{first_name}", firstName);
  replaceTagWithText("#hba1c-prediction", "{hba1c}", hba1c);
  replaceTagWithText("#hba1c-prediction", "{potential-hba1c}", potentialHba1c);
  replaceTagWithText("#weight-prediction", "{weight}", weight);
  replaceTagWithText("#weight-prediction", "{potential-weight}", potentialWeight);
  replaceTagWithText("#cost-savings", "{cost_savings}", costSavings);
  replaceTagWithText("#hba1c-prediction", "{a1c_reduction}", a1cReduction);
  replaceTagWithText("#weight-prediction", "{weight_reduction_perc}", weightReductionPercentage);
  replaceTagWithText("#weight-prediction", "{weight_reduction}", weightReduction);
  replaceTagWithText("#weight-prediction", "{potential_weight}", potentialWeight);

  });

});