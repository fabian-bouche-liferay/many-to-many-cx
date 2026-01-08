import 'manyToManyCX';

const outputNode = fragmentElement.querySelector(".cms-object-relationships");

if(outputNode != null) {

	const FOLDER_ERC = "L_CMS_CONTENT_STRUCTURES";
	const API_BASE = "/o/object-admin/v1.0";

	function el(tag, attrs = {}, children = []) {
		const node = document.createElement(tag);

		Object.entries(attrs).forEach(([k, v]) => {
			if (k === "className") node.className = v;
			else if (k === "text") node.textContent = v;
			else node.setAttribute(k, v);
		});

		(children || []).forEach((c) => {
			if (c == null) return;
			node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
		});

		return node;
	}

	function getRelatedObjectDefinitionId(relationship, sourceObjectDefinitionId) {
		if (relationship.objectDefinitionId1 === sourceObjectDefinitionId) {
			return relationship.objectDefinitionId2;
		}
		if (relationship.objectDefinitionId2 === sourceObjectDefinitionId) {
			return relationship.objectDefinitionId1;
		}

		return relationship.objectDefinitionId2 ?? relationship.objectDefinitionId1;
	}

	async function fetchJSON(url) {
		const res = await Liferay.Util.fetch(url);
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} on ${url}`);
		}
		return res.json();
	}

	(async function main() {
		outputNode.innerHTML = "";

		let definitions;
		try {
			definitions = await fetchJSON(
				`${API_BASE}/object-definitions?filter=` +
				encodeURIComponent(`objectFolderExternalReferenceCode eq '${FOLDER_ERC}'`)
			);
		} catch (e) {
			console.error(e);
			outputNode.appendChild(
				el("div", { className: "alert alert-danger", text: "Failed to fetch definitions." })
			);
			return;
		}

		const definitionCache = new Map();

		const getDefinitionById = (id) => {
			if (!definitionCache.has(id)) {
				definitionCache.set(id, fetchJSON(`${API_BASE}/object-definitions/${id}`));
			}
			return definitionCache.get(id);
		};

		for (const item of (definitions.items || [])) {
			console.log(item);

			const sourceObjectDefinitionId = item.id ?? item.objectDefinitionId;

			const section = el("section", { className: "mb-4" });

			section.appendChild(
				el("h4", { text: item.restContextPath ? item.restContextPath : `(no restContextPath) - id=${sourceObjectDefinitionId}` })
			);

			const ul = el("ul");

			const rels = (item.objectRelationships || []).filter((r) => r.type === "manyToMany");

			if (rels.length === 0) {
				ul.appendChild(el("li", { text: "No manyToMany relation." }));
				section.appendChild(ul);
				outputNode.appendChild(section);
				continue;
			}

			for (const relationship of rels) {
				const li = el("li");

				li.appendChild(
					el("div", { className: "fw-bold", text: `Relationship name: ${relationship.name}` })
				);

				const relatedObjectDefinitionId = getRelatedObjectDefinitionId(
					relationship,
					sourceObjectDefinitionId
				);

				const relatedLine = el("div", { text: "Related Object API Path: (loading…)" });
				li.appendChild(relatedLine);

				try {
					const relatedDef = await getDefinitionById(relatedObjectDefinitionId);
					relatedLine.textContent = `Related Object API Path: ${relatedDef.restContextPath || "(no restContextPath)"}`;
				} catch (e) {
					console.error(e);
					relatedLine.textContent = "Related Object API Path: (error loading related definition)";
				}

				ul.appendChild(li);
			}

			section.appendChild(ul);
			outputNode.appendChild(section);
		}
	})();


}