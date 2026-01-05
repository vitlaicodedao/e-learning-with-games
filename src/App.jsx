import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProgressProvider } from './contexts/GameProgressContext';
import Home from './pages/Home';
import ProgramSelection from './pages/ProgramSelection';
import Profile from './pages/Profile';
import PlacementTest from './pages/PlacementTest';
import Login from './pages/Login';
import Register from './pages/Register';
import GameJourney from './pages/GameJourney';
import ThemeSwitcher from './ui/ThemeSwitcher';
import "./index.css";
// Hóa học area
import ChemistryHome from './areas/Hoahoc/pages/ChemistryHome';
import Dashboard from './areas/Hoahoc/pages/Dashboard';
import ClassDashboard from './areas/Hoahoc/pages/ClassDashboard';
import Lesson from './areas/Hoahoc/pages/Lesson';
import LessonSimple from './areas/Hoahoc/pages/LessonSimple';
import GamePlay from './areas/Hoahoc/pages/GamePlay';
import AdvancedChallenge from './areas/Hoahoc/pages/AdvancedChallenge';
import GhepNguyenTu from './areas/Hoahoc/challenges/GhepNguyenTu';
import TroChoiCanBang from './areas/Hoahoc/challenges/TroChoiCanBang';
import SuyLuanPhanUng from './areas/Hoahoc/challenges/SuyLuanPhanUng';
import DuoiHinhBatChu from './areas/Hoahoc/challenges/DuoiHinhBatChu';
import NhanBietDungDich from './areas/Hoahoc/challenges/NhanBietDungDich';
import XayDungPhanTu from './areas/Hoahoc/challenges/XayDungPhanTu';
import PhaCheDungDich from './areas/Hoahoc/challenges/PhaCheDungDich';
import CauTrucNguyenTu from './areas/Hoahoc/challenges/CauTrucNguyenTu';
import PhongThiNghiem from './areas/Hoahoc/challenges/PhongThiNghiem';
import TinhOxiHoa from './areas/Hoahoc/challenges/TinhOxiHoa';

// Physics area
import PhysicsHome from './areas/Vatly/pages/PhysicsHome';
import PhysicsDashboard from './areas/Vatly/pages/PhysicsDashboard';
import PhysicsClassDashboard from './areas/Vatly/pages/PhysicsClassDashboard';
import PhysicsLesson from './areas/Vatly/pages/PhysicsLesson';
import AdvancedPhysicsChallenge from './areas/Vatly/gamelist/AdvancedPhysicsChallenge';
import PhysicsGradeSelector from './areas/Vatly/gamelist/PhysicsGradeSelector';
import PhysicsGradeGames from './areas/Vatly/gamelist/PhysicsGradeGames';

// Physics challenge games
import BalanceChallenge from './areas/Vatly/challenges/BalanceChallenge/BalanceChallenge';
import ColorMaster from './areas/Vatly/challenges/ColorMaster/ColorMaster';
import ElectromagneticLab from './areas/Vatly/challenges/ElectromagneticLab/ElectromagneticLab';
import NanoLab from './areas/Vatly/challenges/NanoLab/NanoLab';
import PlasmaGame from './areas/Vatly/challenges/PlasmaGame/PlasmaGame';
import ProjectileMotion from './areas/Vatly/challenges/ProjectileMotion/ProjectileMotion';
import StaticElectricity from './areas/Vatly/challenges/StaticElectricity/StaticElectricity';
import ThermoLab from './areas/Vatly/challenges/ThermoLab/ThermoLab';
import WaterLab from './areas/Vatly/challenges/WaterLab/WaterLab';
import MeasurementGame from './areas/Vatly/challenges/MeasurementGame/MeasurementGame';
import MassBalanceGame from './areas/Vatly/challenges/MassBalanceGame/MassBalanceGame';
import ForceWorldGame from './areas/Vatly/challenges/ForceWorldGame/ForceWorldGame';
import WeightMassGame from './areas/Vatly/challenges/WeightMassGame/WeightMassGame';
import SimpleMachineGame from './areas/Vatly/challenges/SimpleMachineGame/SimpleMachineGame';
import PressureChallengeGame from './areas/Vatly/challenges/PressureChallengeGame/PressureChallengeGame';
import ThermometerGame from './areas/Vatly/challenges/ThermometerGame/ThermometerGame';
import ThermalExpansionGame from './areas/Vatly/challenges/ThermalExpansionGame/ThermalExpansionGame';
import EvaporationGame from './areas/Vatly/challenges/EvaporationGame/EvaporationGame';
import BoilingGame from './areas/Vatly/challenges/BoilingGame/BoilingGame';
import HeatTransferGame from './areas/Vatly/challenges/HeatTransferGame/HeatTransferGame';
import ThermalEnergyGame from './areas/Vatly/challenges/ThermalEnergyGame/ThermalEnergyGame';

// Grade 7 Physics Games - Chapter 1: Optics (Quang học)
import LightReflectionGame from './areas/Vatly/challenges/LightReflectionGame/LightReflectionGame';
import MirrorLabGame from './areas/Vatly/challenges/MirrorLabGame/MirrorLabGame';
import LightPathGame from './areas/Vatly/challenges/LightPathGame/LightPathGame';

// Grade 7 Physics Games - Chapter 2: Acoustics (Âm học)
import WaveFrequencyGame from './areas/Vatly/challenges/WaveFrequencyGame/WaveFrequencyGame';
import SoundTransmissionGame from './areas/Vatly/challenges/SoundTransmissionGame/SoundTransmissionGame';
import EchoExplorerGame from './areas/Vatly/challenges/EchoExplorerGame/EchoExplorerGame';

// Grade 7 Physics Games - Chapter 3: Electricity (Điện học)
import ElectricChargeLab from './areas/Vatly/challenges/ElectricChargeLab/ElectricChargeLab';
import CircuitBuilderGame from './areas/Vatly/challenges/CircuitBuilderGame/CircuitBuilderGame';
import ElectricEffectsGame from './areas/Vatly/challenges/ElectricEffectsGame/ElectricEffectsGame';

// Grade 8 Physics Games - Chapter 1: Mechanics (Cơ học)
import RaceTracker from './areas/Vatly/challenges/RaceTracker/RaceTracker';
import ForceArena from './areas/Vatly/challenges/ForceArena/ForceArena';
import PressureMaster from './areas/Vatly/challenges/PressureMaster/PressureMaster';
import ArchimedesChallenge from './areas/Vatly/challenges/ArchimedesChallenge/ArchimedesChallenge';
import EnergyLab from './areas/Vatly/challenges/EnergyLab/EnergyLab';

// Grade 8 Physics Games - Chapter 2: Thermodynamics (Nhiệt học)
import MoleculeMotion from './areas/Vatly/challenges/MoleculeMotion/MoleculeMotion';
import HeatTransferLabGrade8 from './areas/Vatly/challenges/HeatTransferLabGrade8/HeatTransferLabGrade8';
import Calorimeter from './areas/Vatly/challenges/Calorimeter/Calorimeter';
import FuelEnergy from './areas/Vatly/challenges/FuelEnergy/FuelEnergy';
import HeatEngine from './areas/Vatly/challenges/HeatEngine/HeatEngine';

// Grade 9 Physics Games - Chapter 1: Electricity (Điện học)
import OhmLawCircuitLab from './areas/Vatly/challenges/OhmLawCircuitLab/OhmLawCircuitLab';
import CircuitBuilderPro from './areas/Vatly/challenges/CircuitBuilderPro/CircuitBuilderPro';
import PowerHeatMaster from './areas/Vatly/challenges/PowerHeatMaster/PowerHeatMaster';

// Grade 9 Physics Games - Chapter 2: Electromagnetism (Điện từ học)
import MagneticFieldExplorer from './areas/Vatly/challenges/MagneticFieldExplorer/MagneticFieldExplorer';
import ElectromagneticInductionLab from './areas/Vatly/challenges/ElectromagneticInductionLab/ElectromagneticInductionLab';
import ACGeneratorSimulator from './areas/Vatly/challenges/ACGeneratorSimulator/ACGeneratorSimulator';

// Grade 9 Physics Games - Chapter 3: Optics (Quang học)
import LightRefractionLab from './areas/Vatly/challenges/LightRefractionLab/LightRefractionLab';
import LensOpticsChallenge from './areas/Vatly/challenges/LensOpticsChallenge/LensOpticsChallenge';
import ColorSpectrumStudio from './areas/Vatly/challenges/ColorSpectrumStudio/ColorSpectrumStudio';

// Grade 9 Physics Games - Chapter 4: Energy (Năng lượng)
import EnergyTransformationQuest from './areas/Vatly/challenges/EnergyTransformationQuest/EnergyTransformationQuest';
import PowerPlantManager from './areas/Vatly/challenges/PowerPlantManager/PowerPlantManager';
import EnergyConservationHero from './areas/Vatly/challenges/EnergyConservationHero/EnergyConservationHero';

// Grade 10 Physics Games - Chapter 1: Kinematics (Động học)
import MotionTracker from './areas/Vatly/challenges/MotionTracker/MotionTracker';
import FreeFallLab from './areas/Vatly/challenges/FreeFallLab/FreeFallLab';

// Grade 10 Physics Games - Chapter 2: Dynamics (Động lực học)
import NewtonsLawsArena from './areas/Vatly/challenges/NewtonsLawsArena/NewtonsLawsArena';
import FrictionTensionMaster from './areas/Vatly/challenges/FrictionTensionMaster/FrictionTensionMaster';

// Grade 10 Physics Games - Chapter 3: Statics (Tĩnh học)
import EquilibriumChallenge from './areas/Vatly/challenges/EquilibriumChallenge/EquilibriumChallenge';
import RotationDynamics from './areas/Vatly/challenges/RotationDynamics/RotationDynamics';

// Grade 10 Physics Games - Chapter 4: Work & Energy (Công & Năng lượng)
import WorkEnergyTheoremLab from './areas/Vatly/challenges/WorkEnergyTheoremLab/WorkEnergyTheoremLab';
import MechanicalEnergyQuest from './areas/Vatly/challenges/MechanicalEnergyQuest/MechanicalEnergyQuest';

// Grade 10 Physics Games - Chapter 5: Thermodynamics (Nhiệt động lực học)
import HeatTransferSimulator from './areas/Vatly/challenges/HeatTransferSimulator/HeatTransferSimulator';
import GasLawsExplorer from './areas/Vatly/challenges/GasLawsExplorer/GasLawsExplorer';

// Grade 10 Physics Games - Chapter 6: Gas Physics (Chất khí)
import IdealGasPlayground from './areas/Vatly/challenges/IdealGasPlayground/IdealGasPlayground';
import MolecularMotionStudio from './areas/Vatly/challenges/MolecularMotionStudio/MolecularMotionStudio';

// Grade 10 Physics Games - Chapter 7: Thermodynamic Cycles (Chu trình nhiệt động)
import ThermodynamicCycles from './areas/Vatly/challenges/ThermodynamicCycles/ThermodynamicCycles';
import HeatEngineOptimizer from './areas/Vatly/challenges/HeatEngineOptimizer/HeatEngineOptimizer';

// Grade 11 Physics Games - Chapter 1: Oscillations (Dao động)
import SimpleHarmonicMotionLab from './areas/Vatly/challenges/SimpleHarmonicMotionLab/SimpleHarmonicMotionLab';
import OscillationEnergyMaster from './areas/Vatly/challenges/OscillationEnergyMaster/OscillationEnergyMaster';
import ResonanceArena from './areas/Vatly/challenges/ResonanceArena/ResonanceArena';

// Grade 11 Physics Games - Chapter 2: Waves (Sóng)
import WaveInterferenceStudio from './areas/Vatly/challenges/WaveInterferenceStudio/WaveInterferenceStudio';
import SoundWaveExplorer from './areas/Vatly/challenges/SoundWaveExplorer/SoundWaveExplorer';
import UltrasoundApplicationLab from './areas/Vatly/challenges/UltrasoundApplicationLab/UltrasoundApplicationLab';

// Grade 11 Physics Games - Chapter 3: Electricity (Điện học)
import ElectricFieldVisualizer from './areas/Vatly/challenges/ElectricFieldVisualizer/ElectricFieldVisualizer';
import CapacitorCircuitLab from './areas/Vatly/challenges/CapacitorCircuitLab/CapacitorCircuitLab';
import DCCircuitMaster from './areas/Vatly/challenges/DCCircuitMaster/DCCircuitMaster';

// Grade 11 Physics Games - Chapter 4: Magnetism (Từ học)
import MagneticFieldExplorerGrade11 from './areas/Vatly/challenges/MagneticFieldExplorer/MagneticFieldExplorer';
import ElectromagneticInductionLabGrade11 from './areas/Vatly/challenges/ElectromagneticInductionLab/ElectromagneticInductionLab';
import ACCircuitSimulator from './areas/Vatly/challenges/ACCircuitSimulator/ACCircuitSimulator';

// Grade 12 Physics Games - Chapter 1: Electromagnetic Oscillations & Waves (Dao động & sóng điện từ)
import LCOscillatorLab from './areas/Vatly/challenges/LCOscillatorLab/LCOscillatorLab';
import ElectromagneticWaveStudio from './areas/Vatly/challenges/ElectromagneticWaveStudio/ElectromagneticWaveStudio';

// Grade 12 Physics Games - Chapter 2: Light Waves (Sóng ánh sáng)
import LightInterferenceSimulator from './areas/Vatly/challenges/LightInterferenceSimulator/LightInterferenceSimulator';
import SpectrumExplorer from './areas/Vatly/challenges/SpectrumExplorer/SpectrumExplorer';

// Grade 12 Physics Games - Chapter 3: Quantum of Light (Lượng tử ánh sáng)
import PhotoelectricEffectLab from './areas/Vatly/challenges/PhotoelectricEffectLab/PhotoelectricEffectLab';
import SolarCellOptimizer from './areas/Vatly/challenges/SolarCellOptimizer/SolarCellOptimizer';


const AppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/program-selection" element={<ProgramSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game-journey" element={<GameJourney />} />
        <Route path="/program/chemistry" element={<ChemistryHome />} />
        <Route path="/advanced-challenge" element={<AdvancedChallenge />} />
        <Route path="/advanced-challenge/ghep-nguyen-tu" element={<GhepNguyenTu />} />
        <Route path="/advanced-challenge/can-bang" element={<TroChoiCanBang />} />
        <Route path="/advanced-challenge/suy-luan" element={<SuyLuanPhanUng />} />
        <Route path="/advanced-challenge/duoi-hinh" element={<DuoiHinhBatChu />} />
        <Route path="/advanced-challenge/nhan-biet-dung-dich" element={<NhanBietDungDich />} />
        <Route path="/advanced-challenge/xay-dung-phan-tu" element={<XayDungPhanTu />} />
        <Route path="/advanced-challenge/pha-che-dung-dich" element={<PhaCheDungDich />} />
        <Route path="/advanced-challenge/cau-truc-nguyen-tu" element={<CauTrucNguyenTu />} />
        <Route path="/advanced-challenge/phong-thi-nghiem" element={<PhongThiNghiem />} />
        <Route path="/advanced-challenge/tinh-oxi-hoa" element={<TinhOxiHoa />} />
        <Route 
          path="/program/chemistry/dashboard" 
          element={
              <Dashboard />
          } 
        />
        <Route 
          path="/class/:classId" 
          element={<ClassDashboard />}
        />
        <Route 
          path="/lesson/:classId/:chapterId/:lessonId" 
          element={<LessonSimple />}
        />
       <Route 
         path="/gameplay/:classId/:chapterId/:lessonId/:level?" 
         element={<GamePlay />}
       />
        <Route 
          path="/profile" 
          element={
              <Profile />
          } 
        />
        <Route 
          path="/placement-test/:programId?" 
          element={<PlacementTest />}
        />

        {/* Physics Routes */}
        <Route path="/program/physics" element={<PhysicsHome />} />
        <Route path="/program/physics/dashboard" element={<PhysicsDashboard />} />
        <Route path="/physics-class/:classId" element={<PhysicsClassDashboard />} />
        <Route path="/physics-lesson/:classId/:chapterId/:lessonId" element={<PhysicsLesson />} />
        
        {/* Physics Games - New grade-based navigation */}
        <Route path="/physics-games/grades" element={<PhysicsGradeSelector />} />
        <Route path="/physics-games/grade/:gradeId" element={<PhysicsGradeGames />} />
        
        {/* Legacy route - redirect to grade selector */}
        <Route path="/advanced-physics-challenge" element={<PhysicsGradeSelector />} />

        {/* Physics Challenge Games */}
        <Route path="/advanced-physics-challenge/balance" element={<BalanceChallenge />} />
        <Route path="/advanced-physics-challenge/color-master" element={<ColorMaster />} />
        <Route path="/advanced-physics-challenge/electromagnetic" element={<ElectromagneticLab />} />
        <Route path="/advanced-physics-challenge/nanolab" element={<NanoLab />} />
        <Route path="/advanced-physics-challenge/plasma" element={<PlasmaGame />} />
        <Route path="/advanced-physics-challenge/projectile" element={<ProjectileMotion />} />
        <Route path="/advanced-physics-challenge/static" element={<StaticElectricity />} />
        <Route path="/advanced-physics-challenge/thermo" element={<ThermoLab />} />
        <Route path="/advanced-physics-challenge/water" element={<WaterLab />} />
        
        {/* Grade 6 Physics Games - Chapter 1: Mechanics */}
        <Route path="/advanced-physics-challenge/measurement" element={<MeasurementGame />} />
        <Route path="/advanced-physics-challenge/mass-balance" element={<MassBalanceGame />} />
        <Route path="/advanced-physics-challenge/force-world" element={<ForceWorldGame />} />
        <Route path="/advanced-physics-challenge/weight-mass" element={<WeightMassGame />} />
        <Route path="/advanced-physics-challenge/simple-machine" element={<SimpleMachineGame />} />
        <Route path="/advanced-physics-challenge/pressure-challenge" element={<PressureChallengeGame />} />
        
        {/* Grade 6 Physics Games - Chapter 2: Thermodynamics */}
        <Route path="/advanced-physics-challenge/thermometer" element={<ThermometerGame />} />
        <Route path="/advanced-physics-challenge/thermal-expansion" element={<ThermalExpansionGame />} />
        <Route path="/advanced-physics-challenge/evaporation" element={<EvaporationGame />} />
        <Route path="/advanced-physics-challenge/boiling" element={<BoilingGame />} />
        <Route path="/advanced-physics-challenge/heat-transfer" element={<HeatTransferGame />} />
        <Route path="/advanced-physics-challenge/thermal-energy" element={<ThermalEnergyGame />} />
        
        {/* Grade 7 Physics Games - Chapter 1: Optics (Quang học) */}
        <Route path="/advanced-physics-challenge/light-reflection" element={<LightReflectionGame />} />
        <Route path="/advanced-physics-challenge/mirror-lab" element={<MirrorLabGame />} />
        <Route path="/advanced-physics-challenge/light-path" element={<LightPathGame />} />
        
        {/* Grade 7 Physics Games - Chapter 2: Acoustics (Âm học) */}
        <Route path="/physics-games/grade/7/wave-frequency" element={<WaveFrequencyGame />} />
        <Route path="/physics-games/grade/7/sound-transmission" element={<SoundTransmissionGame />} />
        <Route path="/physics-games/grade/7/echo-explorer" element={<EchoExplorerGame />} />
        
        {/* Grade 7 Physics Games - Chapter 3: Electricity (Điện học) */}
        <Route path="/physics-games/grade/7/electric-charge-lab" element={<ElectricChargeLab />} />
        <Route path="/physics-games/grade/7/circuit-builder" element={<CircuitBuilderGame />} />
        <Route path="/physics-games/grade/7/electric-effects" element={<ElectricEffectsGame />} />
        
        {/* Grade 8 Physics Games - Chapter 1: Mechanics (Cơ học) */}
        <Route path="/physics-games/grade/8/race-tracker" element={<RaceTracker />} />
        <Route path="/physics-games/grade/8/force-arena" element={<ForceArena />} />
        <Route path="/physics-games/grade/8/pressure-master" element={<PressureMaster />} />
        <Route path="/physics-games/grade/8/archimedes-challenge" element={<ArchimedesChallenge />} />
        <Route path="/physics-games/grade/8/energy-lab" element={<EnergyLab />} />
        
        {/* Grade 8 Physics Games - Chapter 2: Thermodynamics (Nhiệt học) */}
        <Route path="/physics-games/grade/8/molecule-motion" element={<MoleculeMotion />} />
        <Route path="/physics-games/grade/8/heat-transfer-lab" element={<HeatTransferLabGrade8 />} />
        <Route path="/physics-games/grade/8/calorimeter" element={<Calorimeter />} />
        <Route path="/physics-games/grade/8/fuel-energy" element={<FuelEnergy />} />
        <Route path="/physics-games/grade/8/heat-engine" element={<HeatEngine />} />
        
        {/* Grade 9 Physics Games - Chapter 1: Electricity (Điện học) */}
        <Route path="/physics-games/grade/9/ohm-law-circuit-lab" element={<OhmLawCircuitLab />} />
        <Route path="/physics-games/grade/9/circuit-builder-pro" element={<CircuitBuilderPro />} />
        <Route path="/physics-games/grade/9/power-heat-master" element={<PowerHeatMaster />} />
        
        {/* Grade 9 Physics Games - Chapter 2: Electromagnetism (Điện từ học) */}
        <Route path="/physics-games/grade/9/magnetic-field-explorer" element={<MagneticFieldExplorer />} />
        <Route path="/physics-games/grade/9/electromagnetic-induction-lab" element={<ElectromagneticInductionLab />} />
        <Route path="/physics-games/grade/9/ac-generator-simulator" element={<ACGeneratorSimulator />} />
        
        {/* Grade 9 Physics Games - Chapter 3: Optics (Quang học) */}
        <Route path="/physics-games/grade/9/light-refraction-lab" element={<LightRefractionLab />} />
        <Route path="/physics-games/grade/9/lens-optics-challenge" element={<LensOpticsChallenge />} />
        <Route path="/physics-games/grade/9/color-spectrum-studio" element={<ColorSpectrumStudio />} />
        
        {/* Grade 9 Physics Games - Chapter 4: Energy (Năng lượng) */}
        <Route path="/physics-games/grade/9/energy-transformation-quest" element={<EnergyTransformationQuest />} />
        <Route path="/physics-games/grade/9/power-plant-manager" element={<PowerPlantManager />} />
        <Route path="/physics-games/grade/9/energy-conservation-hero" element={<EnergyConservationHero />} />

        {/* Grade 10 Physics Games - Chapter 1: Kinematics (Động học) */}
        <Route path="/physics-games/grade/10/motion-tracker" element={<MotionTracker />} />
        <Route path="/physics-games/grade/10/free-fall-lab" element={<FreeFallLab />} />
        
        {/* Grade 10 Physics Games - Chapter 2: Dynamics (Động lực học) */}
        <Route path="/physics-games/grade/10/newtons-laws-arena" element={<NewtonsLawsArena />} />
        <Route path="/physics-games/grade/10/friction-tension-master" element={<FrictionTensionMaster />} />
        
        {/* Grade 10 Physics Games - Chapter 3: Statics (Tĩnh học) */}
        <Route path="/physics-games/grade/10/equilibrium-challenge" element={<EquilibriumChallenge />} />
        <Route path="/physics-games/grade/10/rotation-dynamics" element={<RotationDynamics />} />
        
        {/* Grade 10 Physics Games - Chapter 4: Work & Energy (Công & Năng lượng) */}
        <Route path="/physics-games/grade/10/work-energy-theorem-lab" element={<WorkEnergyTheoremLab />} />
        <Route path="/physics-games/grade/10/mechanical-energy-quest" element={<MechanicalEnergyQuest />} />
        
        {/* Grade 10 Physics Games - Chapter 5: Thermodynamics (Nhiệt động lực học) */}
        <Route path="/physics-games/grade/10/heat-transfer-simulator" element={<HeatTransferSimulator />} />
        <Route path="/physics-games/grade/10/gas-laws-explorer" element={<GasLawsExplorer />} />
        
        {/* Grade 10 Physics Games - Chapter 6: Gas Physics (Chất khí) */}
        <Route path="/physics-games/grade/10/ideal-gas-playground" element={<IdealGasPlayground />} />
        <Route path="/physics-games/grade/10/molecular-motion-studio" element={<MolecularMotionStudio />} />
        
        {/* Grade 10 Physics Games - Chapter 7: Thermodynamic Cycles (Chu trình nhiệt động) */}
        <Route path="/physics-games/grade/10/thermodynamic-cycles" element={<ThermodynamicCycles />} />
        <Route path="/physics-games/grade/10/heat-engine-optimizer" element={<HeatEngineOptimizer />} />
        
        {/* Grade 11 Physics Games - Chapter 1: Oscillations (Dao động) */}
        <Route path="/physics-games/grade/11/simple-harmonic-motion-lab" element={<SimpleHarmonicMotionLab />} />
        <Route path="/physics-games/grade/11/oscillation-energy-master" element={<OscillationEnergyMaster />} />
        <Route path="/physics-games/grade/11/resonance-arena" element={<ResonanceArena />} />
        
        {/* Grade 11 Physics Games - Chapter 2: Waves (Sóng) */}
        <Route path="/physics-games/grade/11/wave-interference-studio" element={<WaveInterferenceStudio />} />
        <Route path="/physics-games/grade/11/sound-wave-explorer" element={<SoundWaveExplorer />} />
        <Route path="/physics-games/grade/11/ultrasound-application-lab" element={<UltrasoundApplicationLab />} />
        
        {/* Grade 11 Physics Games - Chapter 3: Electricity (Điện học) */}
        <Route path="/physics-games/grade/11/electric-field-visualizer" element={<ElectricFieldVisualizer />} />
        <Route path="/physics-games/grade/11/capacitor-circuit-lab" element={<CapacitorCircuitLab />} />
        <Route path="/physics-games/grade/11/dc-circuit-master" element={<DCCircuitMaster />} />
        
        {/* Grade 11 Physics Games - Chapter 4: Magnetism (Từ học) */}
        <Route path="/physics-games/grade/11/magnetic-field-explorer" element={<MagneticFieldExplorerGrade11 />} />
        <Route path="/physics-games/grade/11/electromagnetic-induction-lab" element={<ElectromagneticInductionLabGrade11 />} />
        <Route path="/physics-games/grade/11/ac-circuit-simulator" element={<ACCircuitSimulator />} />
        
        {/* Grade 12 Physics Games - Chapter 1: Electromagnetic Oscillations & Waves (Dao động & sóng điện từ) */}
        <Route path="/physics-games/grade/12/lc-oscillator-lab" element={<LCOscillatorLab />} />
        <Route path="/physics-games/grade/12/electromagnetic-wave-studio" element={<ElectromagneticWaveStudio />} />
        
        {/* Grade 12 Physics Games - Chapter 2: Light Waves (Sóng ánh sáng) */}
        <Route path="/physics-games/grade/12/light-interference-simulator" element={<LightInterferenceSimulator />} />
        <Route path="/physics-games/grade/12/spectrum-explorer" element={<SpectrumExplorer />} />
        
        {/* Grade 12 Physics Games - Chapter 3: Quantum of Light (Lượng tử ánh sáng) */}
        <Route path="/physics-games/grade/12/photoelectric-effect-lab" element={<PhotoelectricEffectLab />} />
        <Route path="/physics-games/grade/12/solar-cell-optimizer" element={<SolarCellOptimizer />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProgressProvider>

          {/* HEADER - thêm component chuyển theme */}
          <header style={{ padding: "10px" }}>
            <ThemeSwitcher />
          </header>

          <AppContent />

        </GameProgressProvider>
      </AuthProvider>
      
    </Router>
  );
}

export default App;


