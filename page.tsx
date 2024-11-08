// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';

export default function Workout() {
  const [workoutName, setWorkoutName] = useState("Workout Name");
  const [exercises, setExercises] = useState([{ name: "", sets: [{ weight: "", reps: "" }] }]);
  const [menuOpen, setMenuOpen] = useState<number | null>(null); // Track the menu open state for each exercise
  const [hamburgerOpen, setHamburgerOpen] = useState(false); // Track the hamburger menu state

  const hamburgerRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: [{ weight: "", reps: "" }] }]);
    setHamburgerOpen(false); // Close the menu after adding exercise
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === exerciseIndex ? { ...exercise, sets: [...exercise.sets, { weight: "", reps: "" }] } : exercise
    );
    setExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex: number) => {
    const updatedExercises = exercises.map((exercise, i) =>
      i === exerciseIndex && exercise.sets.length > 1 // Ensure at least one set remains
        ? { ...exercise, sets: exercise.sets.slice(0, -1) }
        : exercise
    );
    setExercises(updatedExercises);
  };

  const removeExercise = (exerciseIndex: number) => {
    setExercises(exercises.filter((_, i) => i !== exerciseIndex));
  };

  const toggleMenu = (index: number) => {
    setMenuOpen(menuOpen === index ? null : index); // Toggle three-dots menu
  };

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen); // Toggle hamburger menu open/close
  };

  const saveWorkoutRoutine = () => {
    console.log("Workout Routine Saved:", { workoutName, exercises });
    alert("Workout Routine Saved!");
    setHamburgerOpen(false); // Close the menu after saving workout
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setHamburgerOpen(false); // Close hamburger menu
      }
      if (
        menuOpen !== null &&
        menuRefs.current[menuOpen] &&
        !menuRefs.current[menuOpen]?.contains(event.target as Node)
      ) {
        setMenuOpen(null); // Close exercise-specific menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Workout Name"
          className="text-xl font-bold bg-transparent border-b border-transparent focus:border-gray-500 outline-none"
        />
        {/* Hamburger menu button */}
        <div ref={hamburgerRef}>
          <button onClick={toggleHamburger} className="text-3xl text-gray-500 p-2 rounded-full hover:bg-gray-700">
            ☰
          </button>

          {/* Hamburger dropdown menu */}
          {hamburgerOpen && (
            <div className="absolute top-16 right-4 bg-gray-800 text-white rounded shadow-lg p-2 space-y-2 z-10">
              <button
                onClick={addExercise}
                className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded"
              >
                Add Exercise
              </button>
              <button
                onClick={saveWorkoutRoutine}
                className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded"
              >
                Save Workout Routine
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mt-4 space-y-8 pb-16">
        {exercises.map((exercise, index) => (
          <div key={index} className="space-y-2 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(e) => {
                    const updatedExercises = exercises.map((ex, i) =>
                      i === index ? { ...ex, name: e.target.value } : ex
                    );
                    setExercises(updatedExercises);
                  }}
                  placeholder="Exercise Name"
                  className="text-lg font-semibold bg-transparent border-b border-transparent focus:border-gray-500 outline-none flex-1"
                />
                {/* Three-dots menu button */}
                <button
                  onClick={() => toggleMenu(index)}
                  className="text-gray-500 text-3xl p-2 ml-4 rounded-full hover:bg-gray-700"
                  style={{ marginRight: "15px" }}
                >
                  ⋮
                </button>
              </div>

              {/* Dropdown menu for each exercise */}
              {menuOpen === index && (
                <div
                  ref={(el) => (menuRefs.current[index] = el)}
                  className="absolute top-10 right-0 bg-gray-800 text-white rounded shadow-lg p-2 space-y-2 z-10"
                >
                  <button
                    onClick={() => {
                      addSet(index);
                      setMenuOpen(null); // Close the menu after action
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded"
                  >
                    Add Set
                  </button>
                  <button
                    onClick={() => {
                      removeSet(index);
                      setMenuOpen(null); // Close the menu after action
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded"
                  >
                    Remove Last Set
                  </button>
                  <button
                    onClick={() => {
                      removeExercise(index);
                      setMenuOpen(null); // Close the menu after action
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-700 rounded text-red-500"
                  >
                    Remove Exercise
                  </button>
                </div>
              )}
            </div>

            <table className="w-full text-center">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-1">SET</th>
                  <th className="py-1">WEIGHT</th>
                  <th className="py-1">REPS</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set, setIndex) => (
                  <tr key={setIndex} className="text-white-500">
                    <td className="py-2">{setIndex + 1}</td>
                    <td className="py-2">
                      <input
                        type="text"
                        value={set.weight}
                        onChange={(e) => {
                          const updatedExercises = exercises.map((ex, exIndex) =>
                            exIndex === index
                              ? {
                                  ...ex,
                                  sets: ex.sets.map((s, sIndex) =>
                                    sIndex === setIndex ? { ...s, weight: e.target.value } : s
                                  ),
                                }
                              : ex
                          );
                          setExercises(updatedExercises);
                        }}
                        placeholder="Weight"
                        className="px-3 py-1 bg-red-600 text-white rounded-md w-20 text-center outline-none" // Increased width for full placeholder display
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="text"
                        value={set.reps}
                        onChange={(e) => {
                          const updatedExercises = exercises.map((ex, exIndex) =>
                            exIndex === index
                              ? {
                                  ...ex,
                                  sets: ex.sets.map((s, sIndex) =>
                                    sIndex === setIndex ? { ...s, reps: e.target.value } : s
                                  ),
                                }
                              : ex
                          );
                          setExercises(updatedExercises);
                        }}
                        placeholder="Reps"
                        className="px-3 py-1 bg-red-600 text-white rounded-md w-20 text-center outline-none" // Increased width for full placeholder display
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>

      <footer className="p-4 flex justify-around border-t border-gray-700 bg-black">
        <button className="text-gray-500">
          <i className="icon-home" />
        </button>
        <button className="text-gray-500">
          <i className="icon-heart" />
        </button>
        <button className="text-gray-500">
          <i className="icon-calendar" />
        </button>
        <button className="text-gray-500">
          <i className="icon-chart" />
        </button>
        <button className="text-gray-500">
          <i className="icon-settings" />
        </button>
      </footer>
    </div>
  );
}
