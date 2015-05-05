cd schemas
del /q *.*
cd ../

node node_modules\json-schema-generator\index.js --schemadir schemas --file json\farmbuild-soil-areas-in.json
cd schemas
ren n.json farmbuild-soil-areas-in.json
cd ../

node node_modules\json-schema-generator\index.js --schemadir schemas --file json\farmbuild-soil-areas-out.json
cd schemas
ren n.json farmbuild-soil-areas-out.json
cd ../