SELECT
    object_id
    ,ra
    ,dec
    ,i_cmodel_mag
    ,i_cmodel_magerr
    ,y_cmodel_mag
    ,y_cmodel_magerr
FROM
    hscla2020_wide.forced
WHERE
    $coord_in_selection_box
    AND isprimary
LIMIT 5000
