const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/db");

router.get("/", function (req, res) {
  connection.query(
    "select nama_lengkap,ayah,ibu, no_kk, status_hubungan_dalam_keluarga from detail_kk inner join ktp on detail_kk.nik = ktp.nik order by id_detail desc",
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server gagal",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "detail kk tersedia",
          data: rows[0],
        });
      }
    }
  );
});

router.post('/store',[
  body('no_kk').notEmpty(),
  body('nik').notEmpty(),
  body('status_hubungan_dalam_keluarga').notEmpty(),
  body('ayah').notEmpty(),
  body('ibu').notEmpty(),
],(req,res) =>{
  const error = validationResult(req);
  if (!error.isEmpty()){
    return res.status(400).json({
      error: error,
    })
  }
  let data ={
    no_kk : req.body.no_kk,
    nik : req.body.nik,
    status_hubungan_dalam_keluarga : req.body.status_hubungan_dalam_keluarga,
    ayah : req.body.ayah,
    ibu : req.body.ibu
  }
  connection.query('insert into detail_kk set ?',data,(err,rows) =>{
    if(err){
      return res.status(500).json({
        status: false,
        message : 'server error',
      })
    }else{
      return res.status(200).json({
        status : true,
        message: 'data detail kk berhasil ditambah',
        data : rows[0]
      })
    }
  })
})

router.get("/(:id)", function (req, res) {
  let id = req.params.id;
  connection.query(`select * from detail_kk where id_detail='${id}'`, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "server error",
      });
    }
    if (rows.length <= 0) {
      return res.status(400).json({
        status: false,
        message: "not found",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "data tersebut ada",
        data: rows[0],
      });
    }
  });
})
router.patch("/update/:id", [
  body('nik').notEmpty(),
  body('no_kk').notEmpty(),
  body('status_hubungan_dalam_keluarga').notEmpty(),
  body('ayah').notEmpty(),
  body('ibu').notEmpty()
], (req, res) => {
  const error = validationResult(req);
  if(!error.isEmpty()){
      return res.status(422).json({
          error :error.array()
      });
  }
  let id = req.params.id;
  let data = {
      nik : req.body.nik,
      no_kk : req.body.no_kk,
      status_hubungan_dalam_keluarga : req.body.status_hubungan_dalam_keluarga,
      ayah : req.body.ayah,
      ibu : req.body.ibu
  }
  connection.query(`update detail_kk set ? where id_detail = ${id}`,data,function(err,rows){
      if(err){
        return res.status(500).json({
          status : false,
          message : 'server error',
          error : err
        })
      }else {
        return res.status(200).json({
          status : true,
          message : 'update data berhasil......'
        })
      }
    })
}
)

router.delete('/delete/(:id)', function (req, res){
  let id = req.params.id;
  connection.query(`delete from detail_kk where id_detail = ${id}`,function (err,rows){
  if(err){
    return req.status(500).json({
      status : false,
      message : 'server error',
    })
  }else{
    return res.status(200).json({
      status : true,
      message : 'data berhasil dihapus',
    })
  }
  })
})


module.exports = router;
