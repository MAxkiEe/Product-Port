<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    */

    'accepted' => 'ฟิลด์ :attribute ต้องได้รับการยอมรับ',
    'active_url' => 'ฟิลด์ :attribute ต้องเป็น URL ที่ถูกต้อง',
    'after' => 'ฟิลด์ :attribute ต้องเป็นวันที่หลังจาก :date.',
    'alpha' => 'ฟิลด์ :attribute ต้องประกอบด้วยตัวอักษรเท่านั้น',
    'alpha_dash' => 'ฟิลด์ :attribute ต้องประกอบด้วยตัวอักษร ตัวเลข ขีดกลาง และขีดล่างเท่านั้น',
    'alpha_num' => 'ฟิลด์ :attribute ต้องประกอบด้วยตัวอักษรและตัวเลขเท่านั้น',
    'array' => 'ฟิลด์ :attribute ต้องเป็นอาเรย์',
    'before' => 'ฟิลด์ :attribute ต้องเป็นวันที่ก่อน :date.',
    'between' => [
        'numeric' => 'ฟิลด์ :attribute ต้องอยู่ระหว่าง :min และ :max.',
        'file' => 'ไฟล์ :attribute ต้องมีขนาดระหว่าง :min ถึง :max กิโลไบต์',
        'string' => 'ฟิลด์ :attribute ต้องมีความยาวระหว่าง :min ถึง :max ตัวอักษร',
        'array' => 'ฟิลด์ :attribute ต้องมีรายการระหว่าง :min ถึง :max รายการ',
    ],
    'boolean' => 'ฟิลด์ :attribute ต้องเป็นจริงหรือเท็จ',
    'confirmed' => 'การยืนยันรหัสผ่านไม่ตรงกัน',
    'date' => 'ฟิลด์ :attribute ต้องเป็นวันที่ที่ถูกต้อง',
    'date_format' => 'ฟิลด์ :attribute ไม่ตรงกับรูปแบบ :format.',
    'different' => 'ฟิลด์ :attribute และ :other ต้องแตกต่างกัน',
    'digits' => 'ฟิลด์ :attribute ต้องเป็นตัวเลข :digits หลัก',
    'digits_between' => 'ฟิลด์ :attribute ต้องเป็นตัวเลขระหว่าง :min ถึง :max หลัก',
    'email' => 'ฟิลด์ :attribute ต้องเป็นอีเมลฟอร์แมตที่ถูกต้อง',
    'exists' => 'ฟิลด์ :attribute ที่เลือกไม่ถูกต้อง',
    'file' => 'ฟิลด์ :attribute ต้องเป็นไฟล์',
    'filled' => 'ฟิลด์ :attribute ต้องมีค่า',
    'image' => 'ฟิลด์ :attribute ต้องเป็นรูปภาพ',
    'in' => 'ฟิลด์ :attribute ที่เลือกไม่ถูกต้อง',
    'integer' => 'ฟิลด์ :attribute ต้องเป็นจำนวนเต็ม',
    'ip' => 'ฟิลด์ :attribute ต้องเป็น IP แอดเดรสที่ถูกต้อง',
    'max' => [
        'numeric' => 'ฟิลด์ :attribute ต้องไม่มากกว่า :max.',
        'file' => 'ไฟล์ :attribute ต้องไม่ใหญ่กว่า :max กิโลไบต์',
        'string' => 'ฟิลด์ :attribute ต้องไม่ยาวกว่า :max ตัวอักษร',
        'array' => 'ฟิลด์ :attribute ต้องไม่มีเกิน :max รายการ',
    ],
    'mimes' => 'ฟิลด์ :attribute ต้องเป็นไฟล์ประเภท: :values.',
    'mimetypes' => 'ฟิลด์ :attribute ต้องเป็นไฟล์ประเภท: :values.',
    'min' => [
        'numeric' => 'ฟิลด์ :attribute ต้องอย่างน้อย :min.',
        'file' => 'ไฟล์ :attribute ต้องมีขนาดอย่างน้อย :min กิโลไบต์',
        'string' => 'ฟิลด์ :attribute ต้องมีความยาวอย่างน้อย :min ตัวอักษร',
        'array' => 'ฟิลด์ :attribute ต้องมีอย่างน้อย :min รายการ',
    ],
    'not_in' => 'ฟิลด์ :attribute ที่เลือกไม่ถูกต้อง',
    'numeric' => 'ฟิลด์ :attribute ต้องเป็นตัวเลข',
    'password' => [
        'letters' => 'ฟิลด์ :attribute ต้องมีตัวอักษรอย่างน้อย 1 ตัว',
        'mixed' => 'ฟิลด์ :attribute ต้องมีตัวอักษรพิมพ์ใหญ่และพิมพ์เล็กอย่างน้อย 1 ตัว',
        'numbers' => 'ฟิลด์ :attribute ต้องมีตัวเลขอย่างน้อย 1 ตัว',
        'symbols' => 'ฟิลด์ :attribute ต้องมีสัญลักษณ์อย่างน้อย 1 ตัว',
        'uncompromised' => 'รหัสผ่านหลุดรอด กรุณาเปลี่ยนรหัสผ่าน',
    ],
    'present' => 'ฟิลด์ :attribute ต้องมีอยู่',
    'regex' => 'รูปแบบฟิลด์ :attribute ไม่ถูกต้อง',
    'required' => 'จำเป็นต้องระบุ :attribute',
    'required_if' => 'จำเป็นต้องระบุ :attribute เมื่อ :other เป็น :value.',
    'required_unless' => 'จำเป็นต้องระบุ :attribute เว้นแต่ :other อยู่ใน :values.',
    'required_with' => 'จำเป็นต้องระบุ :attribute เมื่อมี :values.',
    'required_with_all' => 'จำเป็นต้องระบุ :attribute เมื่อมี :values ทุกค่า',
    'required_without' => 'จำเป็นต้องระบุ :attribute เมื่อไม่มี :values.',
    'required_without_all' => 'จำเป็นต้องระบุ :attribute เมื่อไม่มี :values เลย',
    'same' => 'ฟิลด์ :attribute และ :other ต้องตรงกัน',
    'size' => [
        'numeric' => 'ฟิลด์ :attribute ต้องเป็น :size.',
        'file' => 'ไฟล์ :attribute ต้องมีขนาด :size กิโลไบต์',
        'string' => 'ฟิลด์ :attribute ต้องมีความยาว :size ตัวอักษร',
        'array' => 'ฟิลด์ :attribute ต้องมี :size รายการ',
    ],
    'string' => 'ฟิลด์ :attribute ต้องเป็นสตริง',
    'timezone' => 'ฟิลด์ :attribute ต้องเป็นโซนเวลาที่ถูกต้อง',
    'unique' => ':attribute นี้ถูกใช้ไปแล้ว',
    'url' => 'รูปแบบฟิลด์ :attribute ไม่ถูกต้อง',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    */

    'attributes' => [
        'email' => 'อีเมล',
        'password' => 'รหัสผ่าน',
        'name' => 'ชื่อ',
    ],

];
