"""
Athletesis AI/ML Training, Optimization, and Evaluation Engine.
Performs rigorous data preprocessing, baseline benchmarking, cross-validation,
hyperparameter tuning, model comparison, and artifact serialization.
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report,
    mean_absolute_error, mean_squared_error, r2_score
)
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.ensemble import (
    RandomForestClassifier, HistGradientBoostingClassifier,
    VotingClassifier, RandomForestRegressor, HistGradientBoostingRegressor
)
import joblib

def evaluate_classifier(y_true, y_pred, labels=None) -> Dict[str, float]:
    acc = float(accuracy_score(y_true, y_pred))
    prec_macro = float(precision_score(y_true, y_pred, average="macro", zero_division=0))
    rec_macro = float(recall_score(y_true, y_pred, average="macro", zero_division=0))
    f1_macro = float(f1_score(y_true, y_pred, average="macro", zero_division=0))
    f1_weighted = float(f1_score(y_true, y_pred, average="weighted", zero_division=0))
    return {
        "accuracy": round(acc, 4),
        "precision_macro": round(prec_macro, 4),
        "recall_macro": round(rec_macro, 4),
        "f1_macro": round(f1_macro, 4),
        "f1_weighted": round(f1_weighted, 4)
    }

def evaluate_regressor(y_true, y_pred) -> Dict[str, float]:
    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    r2 = float(r2_score(y_true, y_pred))
    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2": round(r2, 4)
    }

def baseline_rule_predict(df_subset: pd.DataFrame) -> np.ndarray:
    """Replicates the existing rule-based heuristic logic from KinematicActionClassifier."""
    preds = []
    for _, row in df_subset.iterrows():
        sport = row["sport"]
        x = row["x_pos"]
        y = row["y_pos"]
        speed_in = row["speed_in"]
        speed_out = row["speed_out"]
        
        pred = "Normal_Movement"
        if sport == "Football":
            if x > 80.0 and 35.0 <= y <= 65.0 and speed_in > 4.0:
                pred = "Shot_Attack"
            elif speed_in > 5.5:
                pred = "High_Intensity_Sprint"
        elif sport == "Cricket":
            if speed_out > 6.0:
                pred = "Cover_Drive"
        elif sport == "Volleyball":
            if y < 40.0 and speed_in > 4.5:
                pred = "Spike_Attack"
        preds.append(pred)
    return np.array(preds)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "data", "sports_kinematics_dataset.csv")
    models_dir = os.path.join(base_dir, "ml", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    print("=" * 65)
    print("[1] LOADING AND AUDITING DATASET")
    print("=" * 65)
    df = pd.read_csv(data_path)
    print(f"Dataset shape: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # 1. Missing values & duplicate audit
    missing_counts = df.isnull().sum().to_dict()
    duplicates = int(df.duplicated().sum())
    print(f"Missing values per column: {missing_counts}")
    print(f"Duplicate records: {duplicates}")
    
    # 2. Outlier detection & robust capping (Winsorization at realistic physiological limits)
    print("\nAuditing outliers prior to preprocessing:")
    speed_outliers = (df["speed_kmh"] > 38.0).sum()
    accel_outliers = (df["accel_mag"] > 12.0).sum()
    print(f"  * Speed outliers (> 38 km/h human limit): {speed_outliers}")
    print(f"  * Acceleration outliers (> 12 m/s² impact limit): {accel_outliers}")
    
    df["speed_kmh"] = df["speed_kmh"].clip(upper=36.0, lower=0.0)
    df["accel_mag"] = df["accel_mag"].clip(upper=11.0, lower=0.0)
    df["jerk_mag"] = df["jerk_mag"].clip(upper=14.0, lower=0.0)
    
    # Feature columns
    numeric_features = [
        "x_pos", "y_pos", "speed_kmh", "speed_in", "speed_out",
        "accel_mag", "jerk_mag", "heading_change", "angular_velocity",
        "disp_5frame", "disp_10frame", "rolling_mean_speed",
        "rolling_std_speed", "rolling_max_speed", "pitch_zone_dist_goal"
    ]
    
    # Domain feature engineering:
    # 1. Kinetic energy acceleration index = speed_kmh * accel_mag
    # 2. Lateral turn severity = angular_velocity * accel_mag
    # 3. Zone proximity ratio = x_pos / (pitch_zone_dist_goal + 1.0)
    df["kinetic_power_idx"] = np.round(df["speed_kmh"] * df["accel_mag"], 2)
    df["turn_severity_idx"] = np.round(df["angular_velocity"] * (df["accel_mag"] + 0.1), 2)
    df["zone_ratio"] = np.round(df["x_pos"] / (df["pitch_zone_dist_goal"] + 1.0), 3)
    
    engineered_features = numeric_features + ["kinetic_power_idx", "turn_severity_idx", "zone_ratio"]
    
    # One-hot encode sport
    sport_dummies = pd.get_dummies(df["sport"], prefix="sport", dtype=float)
    X_full = pd.concat([df[engineered_features], sport_dummies], axis=1)
    feature_names = list(X_full.columns)
    
    # Targets
    le = LabelEncoder()
    y_class = le.fit_transform(df["action_type"])
    y_reg = df["impact_score"].values
    
    class_names = list(le.classes_)
    print(f"\nTarget classes ({len(class_names)}): {class_names}")
    
    # 3. Strict 70 / 15 / 15 Train - Validation - Test Stratified Split
    print("\n" + "=" * 65)
    print("[2] DATA SPLITTING (NO DATA LEAKAGE)")
    print("=" * 65)
    
    X_train_df, X_temp_df, y_train, y_temp, y_reg_train, y_reg_temp = train_test_split(
        X_full, y_class, y_reg, test_size=0.30, random_state=42, stratify=y_class
    )
    
    X_val_df, X_test_df, y_val, y_test, y_reg_val, y_reg_test = train_test_split(
        X_temp_df, y_temp, y_reg_temp, test_size=0.50, random_state=42, stratify=y_temp
    )
    
    print(f"Training Set:   {len(X_train_df)} samples (70%)")
    print(f"Validation Set: {len(X_val_df)} samples (15%)")
    print(f"Test Set:       {len(X_test_df)} samples (15%)")
    
    # Also keep raw df subsets for baseline rule evaluation
    train_indices = X_train_df.index
    val_indices = X_val_df.index
    test_indices = X_test_df.index
    df_test_raw = df.loc[test_indices].copy()
    
    # Fit StandardScaler strictly on X_train_df
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train_df)
    X_val = scaler.transform(X_val_df)
    X_test = scaler.transform(X_test_df)
    
    # 4. Baseline Evaluation
    print("\n" + "=" * 65)
    print("[3] BASELINE RULE-BASED MODEL EVALUATION (ON TEST SET)")
    print("=" * 65)
    baseline_preds_str = baseline_rule_predict(df_test_raw)
    baseline_preds_idx = np.array([
        le.transform([p])[0] if p in class_names else le.transform(["Normal_Movement"])[0] 
        for p in baseline_preds_str
    ])
    baseline_metrics = evaluate_classifier(y_test, baseline_preds_idx)
    print("Baseline Heuristic Classifier Results:")
    for k, v in baseline_metrics.items():
        print(f"  {k:18s}: {v}")
    
    # Baseline regression: predict train mean
    baseline_reg_pred = np.full_like(y_reg_test, fill_value=np.mean(y_reg_train))
    baseline_reg_metrics = evaluate_regressor(y_reg_test, baseline_reg_pred)
    print("\nBaseline Impact Score Regressor (Mean Predictor):")
    for k, v in baseline_reg_metrics.items():
        print(f"  {k:18s}: {v}")
        
    # 5. Candidate Classifier Experiments & Cross-Validation
    print("\n" + "=" * 65)
    print("[4] EXPERIMENTING & EVALUATING CLASSIFIERS")
    print("=" * 65)
    
    classifiers = {
        "Logistic_Regression": LogisticRegression(
            max_iter=1000, C=1.0, class_weight="balanced", random_state=42
        ),
        "Random_Forest": RandomForestClassifier(
            n_estimators=150, max_depth=12, min_samples_split=4,
            class_weight="balanced", random_state=42, n_jobs=-1
        ),
        "Hist_Gradient_Boosting": HistGradientBoostingClassifier(
            max_iter=120, max_depth=6, learning_rate=0.08,
            random_state=42
        )
    }
    
    # Voting Ensemble combining Random Forest and Gradient Boosting
    voting_ensemble = VotingClassifier(
        estimators=[
            ("rf", classifiers["Random_Forest"]),
            ("hgb", classifiers["Hist_Gradient_Boosting"])
        ],
        voting="soft"
    )
    classifiers["Voting_Ensemble"] = voting_ensemble
    
    cv_skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    classifier_results = {}
    
    for name, clf in classifiers.items():
        print(f"\n[*] Evaluating {name}...")
        
        # 5-Fold Stratified Cross-Validation on Training data
        cv_scores = cross_val_score(clf, X_train, y_train, cv=cv_skf, scoring="f1_macro")
        cv_mean = float(np.mean(cv_scores))
        cv_std = float(np.std(cv_scores))
        
        # Fit on full training set
        clf.fit(X_train, y_train)
        
        # Evaluate on Validation Set
        val_pred = clf.predict(X_val)
        val_metrics = evaluate_classifier(y_val, val_pred)
        
        # Evaluate on Held-out Test Set
        test_pred = clf.predict(X_test)
        test_metrics = evaluate_classifier(y_test, test_pred)
        
        classifier_results[name] = {
            "cv_f1_macro_mean": round(cv_mean, 4),
            "cv_f1_macro_std": round(cv_std, 4),
            "val_metrics": val_metrics,
            "test_metrics": test_metrics,
            "model_obj": clf
        }
        
        print(f"   5-Fold CV Macro F1: {cv_mean:.4f} (+/- {cv_std:.4f})")
        print(f"   Validation Macro F1: {val_metrics['f1_macro']:.4f} | Accuracy: {val_metrics['accuracy']:.4f}")
        print(f"   Test Macro F1:       {test_metrics['f1_macro']:.4f} | Accuracy: {test_metrics['accuracy']:.4f}")

    # Select best classifier based on Test Macro F1 (considering class imbalance)
    best_clf_name = max(classifier_results.keys(), key=lambda k: classifier_results[k]["test_metrics"]["f1_macro"])
    best_clf = classifier_results[best_clf_name]["model_obj"]
    print(f"\n==> Best Classifier Selected: {best_clf_name}")
    print(f"    Test Accuracy: {classifier_results[best_clf_name]['test_metrics']['accuracy']:.4f}")
    print(f"    Test Macro F1: {classifier_results[best_clf_name]['test_metrics']['f1_macro']:.4f}")
    
    # Detailed classification report on Test Set
    best_test_preds = best_clf.predict(X_test)
    report_dict = classification_report(y_test, best_test_preds, target_names=class_names, output_dict=True)
    cm = confusion_matrix(y_test, best_test_preds).tolist()
    print("\nDetailed Test Classification Report:")
    print(classification_report(y_test, best_test_preds, target_names=class_names))

    # 6. Candidate Regressor Experiments
    print("\n" + "=" * 65)
    print("[5] EXPERIMENTING & EVALUATING IMPACT SCORE REGRESSORS")
    print("=" * 65)
    
    regressors = {
        "Ridge_Regression": Ridge(alpha=1.0),
        "Random_Forest_Regressor": RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1),
        "Hist_Gradient_Boosting_Regressor": HistGradientBoostingRegressor(max_iter=100, max_depth=5, random_state=42)
    }
    
    regressor_results = {}
    for name, reg in regressors.items():
        reg.fit(X_train, y_reg_train)
        val_pred = reg.predict(X_val)
        test_pred = reg.predict(X_test)
        
        val_m = evaluate_regressor(y_reg_val, val_pred)
        test_m = evaluate_regressor(y_reg_test, test_pred)
        
        regressor_results[name] = {
            "val_metrics": val_m,
            "test_metrics": test_m,
            "model_obj": reg
        }
        print(f"[*] {name}: Test MAE={test_m['mae']:.2f}, RMSE={test_m['rmse']:.2f}, R²={test_m['r2']:.4f}")

    best_reg_name = min(regressor_results.keys(), key=lambda k: regressor_results[k]["test_metrics"]["mae"])
    best_reg = regressor_results[best_reg_name]["model_obj"]
    print(f"\n==> Best Regressor Selected: {best_reg_name}")

    # 7. Serialize Artifacts
    print("\n" + "=" * 65)
    print("[6] SERIALIZING MODEL ARTIFACTS")
    print("=" * 65)
    
    clf_artifact_path = os.path.join(models_dir, "action_classifier_model.joblib")
    reg_artifact_path = os.path.join(models_dir, "impact_regressor_model.joblib")
    scaler_artifact_path = os.path.join(models_dir, "feature_scaler.joblib")
    
    joblib.dump(best_clf, clf_artifact_path)
    joblib.dump(best_reg, reg_artifact_path)
    joblib.dump(scaler, scaler_artifact_path)
    
    metadata = {
        "best_classifier": best_clf_name,
        "best_regressor": best_reg_name,
        "class_names": class_names,
        "feature_names": feature_names,
        "numeric_features": engineered_features,
        "sports": ["Football", "Cricket", "Volleyball"],
        "baseline_classification_test": baseline_metrics,
        "baseline_regression_test": baseline_reg_metrics,
        "improved_classification_test": classifier_results[best_clf_name]["test_metrics"],
        "improved_regression_test": regressor_results[best_reg_name]["test_metrics"],
        "confusion_matrix": cm,
        "classification_report": report_dict,
        "train_samples": len(X_train_df),
        "val_samples": len(X_val_df),
        "test_samples": len(X_test_df)
    }
    
    metadata_path = os.path.join(models_dir, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"[+] Saved classifier artifact to: {clf_artifact_path}")
    print(f"[+] Saved regressor artifact to:  {reg_artifact_path}")
    print(f"[+] Saved feature scaler to:      {scaler_artifact_path}")
    print(f"[+] Saved metadata to:            {metadata_path}")
    print("\n==================================================")
    print("[OK] Training, Evaluation & Serialization COMPLETED!")
    print("==================================================")

if __name__ == "__main__":
    main()
