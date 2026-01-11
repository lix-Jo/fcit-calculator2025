import React, { useState } from 'react';
import './KAUCalculator.css';

const KAUCalculator = () => {
  // --- States ---
  const [mode, setMode] = useState('menu'); // menu, weighted, gpa, past
  
  const [weightedInputs, setWeightedInputs] = useState({ programming: '', intro: '', statistics: '', writing: '' });
  const [weightedResult, setWeightedResult] = useState(null);
  const [weightedError, setWeightedError] = useState('');

  const [courses, setCourses] = useState([]);
  const [gpaResult, setGpaResult] = useState(null);

  const [gender, setGender] = useState('female');

  // --- Constants ---
  const gradePoints = {
    "A+": 5.0, "A": 4.75, "B+": 4.5, "B": 4.0,
    "C+": 3.5, "C": 3.0, "D+": 2.5, "D": 2.0, "F": 0
  };

  // بيانات السنوات السابقة (شاملة الانصاص)
  const pastWeighted = [
    { batch: "21", female: { CS: 4.67, IT: 4.44, IS: 4.44 }, male: { CS: 4.58, IT: 4.37, IS: 4.36 } },
    { batch: "21.5", female: { CS: 4.60, IT: 4.45, IS: 4.45 }, male: { CS: "-", IT: "-", IS: "-" } },
    { batch: "22", female: { CS: 89, IT: 88, IS: "اقل من 88" }, male: { CS: 88.89, IT: 85, IS: 73.6 } },
    { batch: "22.5", female: { CS: "اعلى من 87", IT: "≈87", IS: "اقل من 87" }, male: { CS: "-", IT: "-", IS: "-" } },
    { batch: "23", female: { CS: 94.81, IT: 91, IS: "اقل من 91" }, male: { CS: 90, IT: 83, IS: "اقل من 83" } },
    { batch: "23.5", female: { CS: 97.50, IT: 92.70, IS: 72.18 }, male: { CS: 90, IT: 83, IS: "اقل من 83" } },
    { batch: "24", female: { CS: 93.82, IT: 88, IS: "اقل من 88" }, male: { CS: 90.24, IT: 83.2, IS: 71.18 } },
    { batch: "24.5", female: { CS: "-", IT: "-", IS: "-" }, male: { CS: 90.68, IT: 82, IS: 73 } },
  ];

  // --- Functions ---
  const handleBack = () => {
    setMode('menu');
    setWeightedResult(null);
    setWeightedError('');
    setGpaResult(null);
  };

  const handleWeightedChange = (e) => {
    setWeightedInputs({ ...weightedInputs, [e.target.name]: e.target.value });
  };

  const calculateWeighted = () => {
    const { programming, intro, statistics, writing } = weightedInputs;
    
    
    if (!programming && !intro && !statistics && !writing) {
      setWeightedError('لا توجد قيم مدخلة، يرجى إدخال الدرجات');
      setWeightedResult(null);
      return;
    }

    const filledCount = [programming, intro, statistics, writing].filter(val => val !== '').length;
    if (filledCount < 4) {
      setWeightedError('تأكد من إدخال جميع الدرجات');
      setWeightedResult(null);
      return;
    }

 
    for (let val of [programming, intro, statistics, writing]) {
      const num = Number(val);
      if (isNaN(num) || num < 0 || num > 100) {
        setWeightedError('مدخلات خاطئة يجب ان تكون الدرجة من 0 الى 100');
        setWeightedResult(null);
        return;
      }
    }

    const total = Number(programming) * 3 + Number(intro) * 3 + Number(statistics) * 3 + Number(writing) * 2;
    setWeightedResult((total / 11).toFixed(2));
    setWeightedError('');
  };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), grade: "A+", hours: 3 }]);
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: field === 'hours' ? Number(value) : value } : course
    ));
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const calculateGPA = () => {
    if (courses.length === 0) return;
    let totalPoints = 0;
    let totalHours = 0;
    courses.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * course.hours;
      totalHours += course.hours;
    });
    if (totalHours === 0) return;
    setGpaResult((totalPoints / totalHours).toFixed(2));
  };

  // --- JSX ---
  return (
    <div className="app-wrapper">
      <div className="calculator-card">
        
        <div className="card-header">
          <h1 className="main-title">حاسبة جامعة الملك عبدالعزيز</h1>
          <p className="sub-title">كلية الحاسبات وتقنية المعلومات</p>
        </div>

        <div className="card-content">
          
          {/* القائمة الرئيسية */}
          {mode === 'menu' && (
            <div className="mode-selector" style={{flexDirection: 'column'}}>
              <button className="mode-btn active" style={{marginBottom: '10px'}} onClick={() => setMode('gpa')}>حساب المعدل الفصلي</button>
              <button className="mode-btn active" style={{marginBottom: '10px'}} onClick={() => setMode('weighted')}>حساب الموزونة</button>
              <button className="mode-btn active" onClick={() => setMode('past')}>موزونة الأعوام السابقة</button>
            </div>
          )}

          {/* حاسبة الموزونة */}
          {mode === 'weighted' && (
            <div>
              <button className="back-btn" onClick={handleBack}>← العودة للقائمة</button>
              
              <div className="input-group">
                <label className="input-label">البرمجة (3 ساعات)</label>
                <input type="number" name="programming" className="input-field" placeholder="أدخل الدرجة" value={weightedInputs.programming} onChange={handleWeightedChange} />
              </div>
              <div className="input-group">
                <label className="input-label">مقدمة حوسبة (3 ساعات)</label>
                <input type="number" name="intro" className="input-field" placeholder="أدخل الدرجة" value={weightedInputs.intro} onChange={handleWeightedChange} />
              </div>
              <div className="input-group">
                <label className="input-label">الإحصاء (3 ساعات)</label>
                <input type="number" name="statistics" className="input-field" placeholder="أدخل الدرجة" value={weightedInputs.statistics} onChange={handleWeightedChange} />
              </div>
              <div className="input-group">
                <label className="input-label">أساليب الكتابة العلمية (ساعتان)</label>
                <input type="number" name="writing" className="input-field" placeholder="أدخل الدرجة" value={weightedInputs.writing} onChange={handleWeightedChange} />
              </div>

              <button className="btn-primary" onClick={calculateWeighted}>احسب الموزونة</button>

              {weightedError && <div className="error-box">{weightedError}</div>}
              
              {weightedResult && (
                <>
                  <div className="result-box">الموزونة الخاصة بك: {weightedResult}</div>
                  <div className="quran-verse">
                    وَأَنْ لَيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ • وَأَنَّ سَعْيَهُ سَوْفَ يُرَىٰ
                  </div>
                </>
              )}
            </div>
          )}

          {/* حاسبة المعدل */}
          {mode === 'gpa' && (
            <div>
              <button className="back-btn" onClick={handleBack}>← العودة للقائمة</button>
              
              <div id="coursesList">
                {courses.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>لا توجد مواد. اضغط على "إضافة مادة" للبدء.</p>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} style={{ display: 'flex', gap: '10px', alignItems: 'end', marginBottom: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label className="input-label" style={{fontSize: '0.8rem'}}>التقدير</label>
                        <select className="input-field" value={course.grade} onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}>
                          {Object.keys(gradePoints).map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <label className="input-label" style={{fontSize: '0.8rem'}}>الساعات</label>
                        <select className="input-field" value={course.hours} onChange={(e) => updateCourse(course.id, 'hours', e.target.value)}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>

                      <button className="btn-danger" onClick={() => deleteCourse(course.id)}>حذف</button>
                    </div>
                  ))
                )}
              </div>

              <button className="btn-secondary" onClick={addCourse}>+ إضافة مادة</button>
              <button className="btn-primary" onClick={calculateGPA}>احسب المعدل</button>
              
              {gpaResult && <div className="result-box">معدلك الفصلي: {gpaResult} من 5.00</div>}
            </div>
          )}

          {/* موزونة الأعوام السابقة */}
          {mode === 'past' && (
            <div>
              <button className="back-btn" onClick={handleBack}>← العودة للقائمة</button>
              
              <div className="mode-selector">
                <button className={`mode-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>طالبات</button>
                <button className={`mode-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>طلاب</button>
              </div>

              <div id="specialtyData">
                {[
                  { code: 'CS', name: 'علوم الحاسب' },
                  { code: 'IT', name: 'تقنية المعلومات' },
                  { code: 'IS', name: 'نظم المعلومات' }
                ].map(spec => (
                  <div key={spec.code} className="specialty-section">
                    <h3 className="specialty-title">موزونات تخصص {spec.name} ({spec.code})</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>الدفعة</th>
                          <th>الموزونة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastWeighted.map((batch, index) => (
                          <tr key={index}>
                            <td>{batch.batch}</td>
                            <td>{batch[gender]?.[spec.code] ?? '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* الفوتر */}
          <footer className="footer">
            في حال واجهتك مشكلة أو تود إضافة ملاحظة تواصل مع: <a href="https://t.me/LIX_JI" target="_blank" rel="noopener noreferrer" className="footer-link">Vega</a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default KAUCalculator;
