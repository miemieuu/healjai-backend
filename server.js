const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

env = process.env;
const app = express();
const port = env.PORT || 4229;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: env.DB_HOST || 'localhost', // ชื่อโฮสต์
  user: env.DB_USER || 'healjaip_db', // ผู้ใช้ที่ระบบแจ้งไว้
  password: env.DB_PASSWORD || '25453055', // รหัสผ่านของผู้ใช้
  database: env.DB_NAME || 'healjaip_db', // ชื่อฐานข้อมูล
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// API ดึงข้อมูลคอนโดทั้งหมด
app.get('/api/condoforsale', (req, res) => {
    db.query('SELECT * FROM condoforsale', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/condoforsale/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM condoforsale WHERE id = ?', [id], (err, results) => {
      if (err) {
          console.log('Error:', err); // ดูข้อความ error
          return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
          console.log('No condo found with ID:', id); // ตรวจสอบว่าไม่มีคอนโดตาม ID หรือไม่
          return res.status(404).json({ error: 'Condo not found' });
      }
      console.log('Condo found:', results[0]); // ดูข้อมูลที่ได้จากฐานข้อมูล
      res.json(results[0]);
  });
});


app.post('/api/condoforsale', (req, res) => {
    const {
        status, tenant_contact, room_image, location, condominium_project_th,
        condominium_project_en, price, size, floor, building, phase,
        bedroom, bathroom, details, map, sample_image, all_images, direction,
        view, facilities
    } = req.body;

    // เปลี่ยนค่าว่าง ("") เป็น NULL
    const handleNull = (value) => (value === "" ? null : value);

    const data = {
        status: handleNull(status),
        tenant_contact: handleNull(tenant_contact),
        room_image: handleNull(room_image),
        location: handleNull(location),
        condominium_project_th: handleNull(condominium_project_th),
        condominium_project_en: handleNull(condominium_project_en),
        price: handleNull(price),
        size: handleNull(size),
        floor: handleNull(floor),
        building: handleNull(building),
        phase: handleNull(phase),
        bedroom: handleNull(bedroom),
        bathroom: handleNull(bathroom),
        details: handleNull(details),
        map: handleNull(map),
        sample_image: handleNull(sample_image),
        all_images: handleNull(all_images),
        direction: handleNull(direction),
        view: handleNull(view),
        facilities: handleNull(facilities),
    };

    const query = `INSERT INTO condoforsale 
(status, tenant_contact, room_image, location, condominium_project_th, condominium_project_en, 
price, size, floor, building, phase, bedroom, bathroom, details, map, sample_image, 
all_images, direction, view, facilities) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


const values = [
    data.status, data.tenant_contact, data.room_image, data.location, data.condominium_project_th, 
    data.condominium_project_en, data.price, data.size, data.floor, data.building, data.phase, 
    data.bedroom, data.bathroom, data.details, data.map, data.sample_image, data.all_images, 
    data.direction, data.view, data.facilities
];


    db.query(query, values, (err, results) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Condo added successfully', id: results.insertId });
    });
});
// API ดึงข้อมูล condo for rent
app.get('/api/condoforrent', (req, res) => {
    db.query('SELECT * FROM condoforrent', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/condoforrent/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM condoforrent WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Condo not found' });
        res.json(results[0]);
    });
});

app.post('/api/condoforrent', (req, res) => {
    const data = req.body;
    const query = `INSERT INTO condoforrent SET ?`;
    db.query(query, data, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Condo for rent added successfully', id: results.insertId });
    });
});



app.get('/api/homeforrent', (req, res) => {
    db.query('SELECT * FROM homeforrent', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/homeforrent/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM homeforrent WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Home not found' });
        res.json(results[0]);
    });
});

app.post('/api/homeforrent', (req, res) => {
    const data = req.body;
    const query = `INSERT INTO homeforrent SET ?`;
    db.query(query, data, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Home for rent added successfully', id: results.insertId });
    });
});



app.get('/api/homeforsale', (req, res) => {
    db.query('SELECT * FROM homeforsale', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/homeforsale/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM homeforsale WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Home not found' });
        res.json(results[0]);
    });
});

app.post('/api/homeforsale', (req, res) => {
    const data = req.body;
    const query = `INSERT INTO homeforsale SET ?`;
    db.query(query, data, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Home for sale added successfully', id: results.insertId });
    });
});

// ลบ condo for sale ตาม ID
app.delete('/api/condoforsale/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM condoforsale WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Condo for sale not found' });
      }
      res.json({ message: 'Deleted condo for sale', id });
    });
  });
  
  // ลบ condo for rent ตาม ID
  app.delete('/api/condoforrent/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM condoforrent WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Condo for rent not found' });
      }
      res.json({ message: 'Deleted condo for rent', id });
    });
  });
  

  app.delete('/api/homeforrent/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM homeforrent WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Home for rent not found' });
      }
      res.json({ message: 'Deleted home for rent', id });
    });
  });
  

  app.delete('/api/homeforsale/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM homeforsale WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Home for sale not found' });
      }
      res.json({ message: 'Deleted home for sale', id });
    });
  });  

  app.put('/api/condoforsale/:id', (req, res) => {
    const { id } = req.params;
    const {
      status,   // เพิ่ม status ที่รับจาก req.body
      detail,
      price,
      tenant_contact,
      room_image,
      location,
      condominium_project_th,
      condominium_project_en,
      size,
      floor,
      building,
      phase,
      bedroom,
      bathroom,
      map,
      sample_image,
      all_images,
      direction,
      view,
      facilities
    } = req.body;
  
    const fields = [
      status, detail, price, tenant_contact, room_image, location, condominium_project_th,
      condominium_project_en, size, floor, building, phase, bedroom, bathroom,
      map, sample_image, all_images, direction, view, facilities
    ];
  
    let sql = 'UPDATE condoforsale SET ';
    const setFields = [];
  
    const fieldNames = [
      'status', 'detail', 'price', 'tenant_contact', 'room_image', 'location', 'condominium_project_th',
      'condominium_project_en', 'size', 'floor', 'building', 'phase', 'bedroom', 'bathroom',
      'map', 'sample_image', 'all_images', 'direction', 'view', 'facilities'
    ];
  
    // ตรวจสอบว่าฟิลด์ใดมีข้อมูลแล้วจึงอัปเดต
    fieldNames.forEach((field, index) => {
      if (fields[index] !== undefined && fields[index] !== null) {
        setFields.push(`${field}=?`);
      }
    });
  
    sql += setFields.join(', ') + ' WHERE id=?';
  
    const params = [...fields.filter((_, index) => fields[index] !== undefined && fields[index] !== null), id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error updating database:", err.message);
        return res.status(500).json({ error: err.message });
      }
  
      if (result.changedRows === 0) {
        return res.status(400).json({ message: 'No changes detected' });
      }
  
      res.json({ message: 'Updated successfully' });
    });
  });
  app.put('/api/condoforrent/:id', (req, res) => {
    const { id } = req.params;
    const {
      status, detail, price, tenant_contact, room_image, location,
      condominium_project_th, condominium_project_en, size, floor,
      building, phase, bedroom, bathroom, map, sample_image,
      all_images, direction, view, facilities
    } = req.body;
  
    const fields = [
      status, detail, price, tenant_contact, room_image, location, condominium_project_th,
      condominium_project_en, size, floor, building, phase, bedroom, bathroom,
      map, sample_image, all_images, direction, view, facilities
    ];
  
    let sql = 'UPDATE condoforrent SET ';
    const setFields = [];
  
    const fieldNames = [
      'status', 'detail', 'price', 'tenant_contact', 'room_image', 'location', 'condominium_project_th',
      'condominium_project_en', 'size', 'floor', 'building', 'phase', 'bedroom', 'bathroom',
      'map', 'sample_image', 'all_images', 'direction', 'view', 'facilities'
    ];
  
    fieldNames.forEach((field, index) => {
      if (fields[index] !== undefined && fields[index] !== null) {
        setFields.push(`${field}=?`);
      }
    });
  
    sql += setFields.join(', ') + ' WHERE id=?';
  
    const params = [...fields.filter((_, index) => fields[index] !== undefined && fields[index] !== null), id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error updating database:", err.message);
        return res.status(500).json({ error: err.message });
      }
  
      if (result.changedRows === 0) {
        return res.status(400).json({ message: 'No changes detected' });
      }
  
      res.json({ message: 'Updated successfully' });
    });
  });
  app.put('/api/homeforsale/:id', (req, res) => {
    const { id } = req.params;
    const {
      status,   // เพิ่ม status ที่รับจาก req.body
      detail,
      price,
      tenant_contact,
      room_image,
      location,
      home_project_th,
      home_project_en,
      size,
      floor,
      building,
      phase,
      bedroom,
      bathroom,
      map,
      sample_image,
      all_images,
      direction,
      view,
      facilities
    } = req.body;
  
    const fields = [
      status, detail, price, tenant_contact, room_image, location, home_project_th,
      home_project_en, size, floor, building, phase, bedroom, bathroom,
      map, sample_image, all_images, direction, view, facilities
    ];
  
    let sql = 'UPDATE condoforsale SET ';
    const setFields = [];
  
    const fieldNames = [
      'status', 'detail', 'price', 'tenant_contact', 'room_image', 'location', 'home_project_th',
      'home_project_en', 'size', 'floor', 'building', 'phase', 'bedroom', 'bathroom',
      'map', 'sample_image', 'all_images', 'direction', 'view', 'facilities'
    ];
  
    // ตรวจสอบว่าฟิลด์ใดมีข้อมูลแล้วจึงอัปเดต
    fieldNames.forEach((field, index) => {
      if (fields[index] !== undefined && fields[index] !== null) {
        setFields.push(`${field}=?`);
      }
    });
  
    sql += setFields.join(', ') + ' WHERE id=?';
  
    const params = [...fields.filter((_, index) => fields[index] !== undefined && fields[index] !== null), id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error updating database:", err.message);
        return res.status(500).json({ error: err.message });
      }
  
      if (result.changedRows === 0) {
        return res.status(400).json({ message: 'No changes detected' });
      }
  
      res.json({ message: 'Updated successfully' });
    });
  });
  app.put('/api/homeforrent/:id', (req, res) => {
    const { id } = req.params;
    const {
      status, detail, price, tenant_contact, room_image, location,
      home_project_th, home_project_en, size, floor,
      building, phase, bedroom, bathroom, map, sample_image,
      all_images, direction, view, facilities
    } = req.body;
  
    const fields = [
      status, detail, price, tenant_contact, room_image, location, home_project_th,
      home_project_en, size, floor, building, phase, bedroom, bathroom,
      map, sample_image, all_images, direction, view, facilities
    ];
  
    let sql = 'UPDATE condoforrent SET ';
    const setFields = [];
  
    const fieldNames = [
      'status', 'detail', 'price', 'tenant_contact', 'room_image', 'location',
      'condominium_project_th', 'condominium_project_en', 'size', 'floor',
      'building', 'phase', 'bedroom', 'bathroom', 'map', 'sample_image',
      'all_images', 'direction', 'view', 'facilities'
    ];
  
    fieldNames.forEach((field, index) => {
      if (fields[index] !== undefined && fields[index] !== null) {
        setFields.push(`${field}=?`);
      }
    });
  
    sql += setFields.join(', ') + ' WHERE id=?';
  
    const params = [...fields.filter((_, index) => fields[index] !== undefined && fields[index] !== null), id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error updating database:", err.message);
        return res.status(500).json({ error: err.message });
      }
  
      if (result.changedRows === 0) {
        return res.status(400).json({ message: 'No changes detected' });
      }
  
      res.json({ message: 'Updated condo for rent successfully' });
    });
  });
  
  

  

const PORT = process.env.PORT || 3000; // ใช้พอร์ต 4229 หรือพอร์ตที่ตั้งค่าใน .env
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});