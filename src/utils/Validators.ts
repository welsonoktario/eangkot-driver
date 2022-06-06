export class Validators {
  static required(value: any) {
    return value ? null : "Required field!";
  }

  static stringLength(min = 0, max = 0) {
    return (value = "") => {
      let result = null;
      if (min > 0 && (value === null || value.length < min))
        result = "Value too short!";
      if (max > 0 && value !== null && value.length > max)
        result = "Value too long!";
      return result;
    };
  }

  static minLength(min = 0) {
    return (value = "") =>
      min > 0 && (value === null || value.length < min)
        ? `Tidak boleh kurang dari ${min} huruf`
        : null;
  }
}
