SELECT
    object_id
    ,ra
    ,dec
    ,f1.i_cmodel_mag
    ,f1.i_cmodel_magsigma
    ,f1.y_cmodel_mag
    ,f1.y_cmodel_magsigma
FROM
    s23b_wide.forced  AS f1
  LEFT JOIN
    s23b_wide.forced2 AS f2 USING (object_id)
  LEFT JOIN
    s23b_wide.meas   AS m1 USING (object_id)
  LEFT JOIN
    s23b_wide.meas2  AS m2 USING (object_id)
WHERE
    $coord_in_selection_box
    AND NOT f1.g_pixelflags_edge
    AND NOT f1.r_pixelflags_edge
    AND NOT f1.i_pixelflags_edge
    AND NOT f1.z_pixelflags_edge
    AND NOT f1.y_pixelflags_edge
    AND NOT f1.g_pixelflags_interpolatedcenter
    AND NOT f1.r_pixelflags_interpolatedcenter
    AND NOT f1.i_pixelflags_interpolatedcenter
    AND NOT f1.z_pixelflags_interpolatedcenter
    AND NOT f1.y_pixelflags_interpolatedcenter
    AND NOT f1.g_pixelflags_saturatedcenter
    AND NOT f1.r_pixelflags_saturatedcenter
    AND NOT f1.i_pixelflags_saturatedcenter
    AND NOT f1.z_pixelflags_saturatedcenter
    AND NOT f1.y_pixelflags_saturatedcenter
    AND NOT f1.g_pixelflags_crcenter
    AND NOT f1.r_pixelflags_crcenter
    AND NOT f1.i_pixelflags_crcenter
    AND NOT f1.z_pixelflags_crcenter
    AND NOT f1.y_pixelflags_crcenter
    AND NOT f1.g_pixelflags_bad
    AND NOT f1.r_pixelflags_bad
    AND NOT f1.i_pixelflags_bad
    AND NOT f1.z_pixelflags_bad
    AND NOT f1.y_pixelflags_bad
    AND isprimary
LIMIT 5000
