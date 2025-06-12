import builtins from "@generated/builtin-data/default/builtins.json";
import React, {useMemo, useState} from "react";
import ReactMarkdown from "react-markdown";

export default function BuiltinSearch({}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedModule, setSelectedModule] = useState("");
	const [isWasm, setIsWasm] = useState("");
	const [selectedVersion, setSelectedVersion] = useState("");

	const allRows = useMemo(()=>{
		return (Object.keys(builtins._categories)
			.map((category) => {
				return builtins._categories[category].map((builtin) => {
					const fn = builtins[builtin];
            				if (!fn) return null;

				        // we have links out there in the wild that use the name without a dot
				        // this needs to be preserved for backwards compatibility.
				        const anchor = `builtin-${category}-${builtin.replaceAll(".", "")}`;
				        const isInfix = !!fn.infix;
				        const isRelation = !!fn.relation;

				        const args = fn.args || [];
				        const result = fn.result || {};

				        const signature = isInfix
				          ? `${args[0]?.name || "x"} ${fn.infix} ${args[1]?.name || "y"}`
				          : isRelation
				          ? `${builtin}(${args.map((a) => a.name).join(", ")}, ${result.name})`
				          : `${result.name || "result"} := ${builtin}(${args.map((a) => a.name).join(", ")})`;
					return {
						name:builtin, 
						module:category, 
						wasm:builtins[builtin].wasm,
						introduced:builtins[builtin].introduced,
						signature:signature,
						anchor:anchor,
						versions:builtins[builtin].available,
					};
				});
			})).reduce((a,b)=>a.concat(b),[])
	});
	const filteredRows = allRows.map((row)=>{
		return (row.name.includes(searchTerm)&&(!selectedModule||row.module==selectedModule))?row:null;
	}).filter((a)=>a!=null&&(searchTerm||selectedModule));
	console.log(filteredRows);
	return(
		<>
		<select value={selectedModule} onChange={(e)=>setSelectedModule(e.target.value)}>
		<option value="">All Modules</option>
		{Object.keys(builtins._categories).map((mod)=>(<option value={mod}>{mod}</option>))}
		</select>
		<input type="text" placeholder="search builtins" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
		{filteredRows.length>0&&(
			<table>
			<thead>
			<tr>
			<th>Module</th>
			<th>Name</th>
			<th>Wasm</th>
			<th>Signature</th>
			<th>Introduced</th>
			</tr>
			</thead>
			<tbody>
			{filteredRows.map((row)=>(
				<tr>
				<td>{row.module}</td>
				<td><a href={`#${row.anchor}`}> {row.name}</a></td>
{row.wasm
                      ? (
                        <span
                          style={{
                            backgroundColor: "seagreen",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            padding: "0.1rem 0.2rem",
                            borderRadius: "0.2rem",
                          }}
                        >
                          Wasm
                        </span>
                      )
                      : (
                        <span
                          style={{
                            backgroundColor: "darkgoldenrod",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            padding: "0.1rem 0.2rem",
                            borderRadius: "0.2rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          SDK-dependent
                        </span>
                      )}

				<td><code>{row.signature}</code></td>
				<td>{row.introduced}</td>
				</tr>
			))}
			</tbody>
			</table>
		)}
		</>
	);
}
