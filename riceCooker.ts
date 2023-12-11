import * as readlineSync from 'readline-sync';

class RiceCooker {
  private isPluggedIn: boolean = false;
  private isCooking: boolean = false;
  private isSteamCooking: boolean = false;
  private isWarm: boolean = false;
  private temperature: number = 0;
  private cookingTime: number = 0;
  private remainingCookingTime: number = 0;
  private riceQuantity: number = 0;
  private waterQuantity: number = 0;
  private defaultTemperature: number = 74;


  private startTime: Date | null = null;

  public plugIn(): void {
    this.isPluggedIn = true;
    console.log("Rice cooker is plugged in.");
  }

  public unplug(): void {
    this.isPluggedIn = false;
    console.log("Rice cooker is unplugged.");
  }

  public addRice(quantity: number): void {
    if (!this.isCooking && quantity > 0) {
      this.riceQuantity += quantity;
      console.log(`Added ${quantity} cups of rice to the cooker.`);
    } else {
      this.handleError("Error adding rice. Please make sure the cooker is not cooking and provide a valid quantity (greater than 0).");
    }
  }

  public addWater(quantity: number): void {
    if (quantity > 0) {
      this.waterQuantity += quantity;
      console.log(`Added ${quantity} cups of water to the cooker.`);
    } else {
      this.handleError("Error adding water. Please provide a valid quantity (greater than 0).");
    }
  }

  public startCooking(): void {
    if (this.isPluggedIn && this.riceQuantity > 0 && this.waterQuantity > 0 && !this.isCooking) {
      this.cookingTime = readlineSync.questionInt("Enter the cooking time (in minutes): ");
      this.isCooking = true;
      this.startTime = new Date();
      this.remainingCookingTime = this.cookingTime;
      console.log("Cooking started.");
      this.displayRemainingCookingTime();
      this.updateRemainingCookingTime();
    } else {
      this.handleError("Error starting cooking. Please check if the cooker is plugged in, rice and water are added, and cooking is not already in progress.");
    }
  }
  

  public stopCooking(): void {
    if (this.isCooking) {
      this.isCooking = false;
      this.remainingCookingTime = 0;
      console.log("Cooking stopped.");
    } else {
      this.handleError("Error stopping cooking. Cooking is not in progress.");
    }
  }

  public startSteamCooking(): void {
    if (this.isPluggedIn && this.isCooking && !this.isSteamCooking) {
      this.isSteamCooking = true;
      console.log("Steam cooking started.");
    } else {
      this.handleError("Error starting steam cooking. Please check if the cooker is plugged in, cooking is in progress, and steam cooking is not already in progress.");
    }
  }

  public stopSteamCooking(): void {
    if (this.isSteamCooking) {
      this.isSteamCooking = false;
      console.log("Steam cooking stopped.");
    } else {
      this.handleError("Error stopping steam cooking. Steam cooking is not in progress.");
    }
  }

  public keepWarm(): void {
    if (this.isPluggedIn && this.isCooking && !this.isWarm) {
      this.isWarm = true;
      console.log("Keep warm function activated.");
    } else {
      this.handleError("Error activating keep warm function. Please check if the cooker is plugged in, cooking is in progress, and keep warm function is not already activated.");
    }
  }

  public displayRemainingTime(): void {
    if (this.isCooking || this.isWarm) {
      this.displayRemainingCookingTime();
    } else {
      this.handleError("Error displaying remaining time. Cooking or keep warm function must be in progress.");
    }
  }

  public setTemperature(temperature: number): void {
    if (this.isPluggedIn) {
      if (temperature >= 55) {
        this.temperature = temperature;
        console.log(`Temperature set to ${this.temperature}°C.`);
      } else {
        this.handleError("Error setting temperature. Temperature must be greater than or equal to 55°C.");
      }
    } else {
      this.handleError("Error setting temperature. Please check if the cooker is plugged in.");
    }
  }
  

  public setCookingTime(time: number): void {
    if (this.isPluggedIn && time > 0) {
      this.cookingTime = time;
      console.log(`Cooking time set to ${this.cookingTime} minutes.`);
      this.updateRemainingCookingTimeImmediate();
    } else {
      this.handleError("Error setting cooking time. Please check if the cooker is plugged in, not cooking, and provide a valid time.");
    }
  }
  

  public clean(): void {
    if (!this.isCooking && !this.isPluggedIn) {
      console.log("Cleaning the rice cooker.");
    } else {
      this.handleError("Error cleaning. Please make sure the cooker is not cooking and it is unplugged before cleaning.");
    }
  }
  

  public displayStatus(): void {
    console.log(`Rice Cooker Status:
      Plugged In: ${this.isPluggedIn}
      Cooking: ${this.isCooking}
      Steam Cooking: ${this.isSteamCooking}
      Keep Warm: ${this.isWarm}
      Temperature: ${this.temperature !== 0 ? this.temperature : this.defaultTemperature}°C
      Rice Quantity: ${this.riceQuantity} cups
      Water Quantity: ${this.waterQuantity} cups`);
  }
  

  private handleError(errorMessage: string): void {
    console.error(`Error: ${errorMessage}`);
  }

  private displayRemainingCookingTime(): void {
    if (this.isCooking && this.remainingCookingTime > 0) {
      console.log(`Cooking time remaining: ${this.remainingCookingTime} minutes.`);
    }
  }

  private updateRemainingCookingTime(): void {
    const interval = setInterval(() => {
      this.remainingCookingTime = this.calculateRemainingCookingTime();
      if (this.remainingCookingTime > 0) {
        this.displayRemainingCookingTime();
      } else {
        clearInterval(interval);
        this.stopCooking();
      }
    }, 60000); 
  }
  
  private updateRemainingCookingTimeImmediate(): void {
  this.remainingCookingTime = this.calculateRemainingCookingTime();
  if (this.remainingCookingTime > 0) {
    this.displayRemainingCookingTime();
  } else {
    this.stopCooking();
  }
}


  private calculateRemainingCookingTime(): number {
    if (this.startTime) {
      const elapsedMinutes = Math.floor((new Date().getTime() - this.startTime.getTime()) / 60000);
      return Math.max(this.cookingTime - elapsedMinutes, 0);
    }
    return 0;
  }
  

  public showMenu(): void {
    console.log(`
    Menu:
    1. Plug In
    2. Unplug
    3. Add Rice
    4. Add Water
    5. Start Cooking
    6. Stop Cooking
    7. Start Steam Cooking
    8. Stop Steam Cooking
    9. Keep Warm
    10. Display Remaining Time
    11. Set Temperature
    12. Set Cooking Time
    13. Clean
    14. Display Status
    15. Exit
    `);
  }

  public performAction(option: number): void {
    switch (option) {
      case 1:
        this.plugIn();
        break;
      case 2:
        this.unplug();
        break;
      case 3:
        let riceQuantity = readlineSync.questionInt("Enter the quantity of rice (in cups): ");
        this.addRice(riceQuantity);
        break;
      case 4:
        let waterQuantity = readlineSync.questionInt("Enter the quantity of water (in cups): ");
        this.addWater(waterQuantity);
        break;
      case 5:
        this.startCooking();
        break;
      case 6:
        this.stopCooking();
        break;
      case 7:
        this.startSteamCooking();
        break;
      case 8:
        this.stopSteamCooking();
        break;
      case 9:
        this.keepWarm();
        break;
      case 10:
        this.displayRemainingTime();
        break;
      case 11:
        let temperatureInput = readlineSync.questionFloat("Enter the temperature (in Celsius): ");
        this.setTemperature(temperatureInput);
        break;
      case 12:
        let cookingTimeInput = readlineSync.questionInt("Enter the cooking time (in minutes): ");
        this.setCookingTime(cookingTimeInput);
        break;
      case 13:
        this.clean();
        break;
      case 14:
        this.displayStatus();
        break;
      case 15:
        console.log("Goodbye!");
        process.exit(0);
      default:
        console.log("Invalid option. Please choose a number between 1 and 15.");
    }
  }

  public startInteractiveMenu(): void {
    while (true) {
      this.showMenu();
      let userInput = readlineSync.question("Enter the option number: ");
      let option = parseInt(userInput);

      this.performAction(option);
    }
  }
}

console.log("Welcome to the Rice Cooker Management Program!");

let riceCooker = new RiceCooker();
riceCooker.startInteractiveMenu();
